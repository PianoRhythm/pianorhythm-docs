# Critical Fix: Monotonic Clock Usage in Note Buffer Engine

## **CRITICAL ISSUE**: Non-Monotonic Clock for Duration Calculations

The current implementation uses `chrono::Utc::now()` for measuring durations between notes, which is fundamentally flawed and likely the **root cause** of many timing issues.

## The Problem

### Wall-Clock vs Monotonic Clock

**Wall-Clock Time** (`chrono::Utc::now()`):
- Can jump forwards or backwards
- Affected by NTP synchronization
- Adjusted for daylight saving time
- Modified by user or system

**Monotonic Clock** (`std::time::Instant`):
- Always moves forward
- Constant rate progression
- Immune to system clock adjustments
- Designed for duration measurements

### Current Problematic Implementation

<augment_code_snippet path="pianorhythm_core/core/src/common/note_buffer_engine.rs" mode="EXCERPT">
````rust
match self.note_buffer_time {
    None => {
        self.note_buffer_time = Some(chrono::Utc::now().timestamp_millis());
        // ...
    }
    Some(nbft) => {
        let delay = chrono::Utc::now().timestamp_millis() - nbft;
        // ...
    }
}
````
</augment_code_snippet>

### Real-World Impact

**Scenario**: User is playing piano when NTP sync occurs
1. First note recorded at wall-clock time: `1000ms`
2. NTP sync adjusts clock backwards by `500ms`
3. Second note recorded at wall-clock time: `800ms`
4. **Calculated delay**: `800 - 1000 = -200ms` (negative!)
5. **Result**: Note timing becomes completely wrong

**Symptoms**:
- Negative delays causing notes to be scheduled incorrectly
- Extreme positive delays when clock jumps forward
- Arrhythmic playback when system clock changes
- Notes appearing to "disappear" (actually scheduled far in future/past)

## The Solution

### Step 1: Replace Duration Calculations with Monotonic Clock

The NoteBufferEngine now integrates with EnhancedTimeSync and AdaptiveFlushTimer for improved timing:

```rust
use std::time::Instant;
use chrono::{DateTime, Utc};
use crate::common::enhanced_time_sync::EnhancedTimeSync;
use crate::common::adaptive_flush_timer::{AdaptiveFlushTimer, AdaptiveFlushConfig};

pub struct NoteBufferEngine {
    note_buffer: Vec<MidiMessageInputDto_MidiMessageInputBuffer>,

    // CHANGED: Use monotonic clock for duration calculations
    note_buffer_start: Option<Instant>,

    // KEEP: Wall-clock time for server synchronization
    note_buffer_wall_time: Option<DateTime<Utc>>,

    // ENHANCED: Integrated timing systems
    enhanced_time_sync: EnhancedTimeSync,
    adaptive_timer: AdaptiveFlushTimer,
    flush_callback: Option<Box<dyn Fn(u32) + Send + 'static>>,

    pub server_time_offset: i64,
    max_note_buffer_size: usize,
    // ... other fields
}

impl NoteBufferEngine {
    pub fn new(on_handle: NoteBufferEngineOnFlushedBuffer) -> Self {
        NoteBufferEngine {
            note_buffer: vec![],
            note_buffer_start: None,
            note_buffer_wall_time: None,
            enhanced_time_sync: EnhancedTimeSync::new(),
            adaptive_timer: AdaptiveFlushTimer::new(AdaptiveFlushConfig::default()),
            flush_callback: None,
            server_time_offset: 0,
            max_note_buffer_size: 300,
            // ... other field initialization
            on_handle,
        }
    }

    pub fn process_message(&mut self, dto: MidiDto) {
        if self.client_is_self_muted || self.room_is_self_hosted || self.stop_emitting_to_ws_when_alone {
            return;
        }

        // Record note activity for adaptive timing
        self.adaptive_timer.record_note_activity();

        match self.note_buffer_start {
            None => {
                // Initialize both clocks simultaneously
                self.note_buffer_start = Some(Instant::now());
                self.note_buffer_wall_time = Some(Utc::now());

                let mut delay = 0;
                if dto.messageType == MidiDtoType::NoteOff {
                    delay = 40;
                }

                self.push_to_note_buffer(dto, delay);
            }
            Some(start_time) => {
                // Use monotonic clock for accurate duration
                let delay = start_time.elapsed().as_millis() as i64;
                self.push_to_note_buffer(dto, delay);
            }
        }

        // Check if adaptive flush is needed
        let buffer_utilization = self.note_buffer.len() as f32 / self.max_note_buffer_size as f32;
        let next_interval = self.adaptive_timer.calculate_next_interval(buffer_utilization);

        if next_interval == 0 {
            // Flush immediately
            self.flush_buffer();
        } else if let Some(callback) = &self.flush_callback {
            // Reschedule flush with adaptive interval
            callback(next_interval);
        }
    }

    pub fn flush_buffer(&mut self) {
        if let (Some(_start_time), Some(wall_time)) = (self.note_buffer_start, self.note_buffer_wall_time) {
            if self.note_buffer.is_empty() {
                return;
            }

            let mut output = MidiMessageInputDto::new();

            // Use enhanced time sync for more accurate server time
            let local_time = Utc::now().timestamp_millis();
            let synchronized_time = self.enhanced_time_sync.get_synchronized_time(local_time);
            output.set_time(format!("{}", synchronized_time));

            output.set_data(RepeatedField::from_vec(self.note_buffer.clone()));

            if self.debug_mode {
                log::info!(
                    "Flushing buffer: {} notes, sync confidence: {:.2}",
                    self.note_buffer.len(),
                    self.enhanced_time_sync.get_confidence()
                );
            }

            (self.on_handle)(output);

            // Reset both clocks
            self.note_buffer_start = None;
            self.note_buffer_wall_time = None;
            self.note_buffer = vec![];
        }
    }

    pub fn clean_up(&mut self) {
        self.note_buffer_start = None;
        self.note_buffer_wall_time = None;
        self.note_buffer = vec![];
    }

    /// Updates time synchronization with server timing data
    pub fn update_server_timing(&mut self, ping_time: i64, server_time: i64, local_time: i64) {
        self.enhanced_time_sync.update_timing(ping_time, server_time, local_time);

        // Update legacy server_time_offset for backward compatibility
        self.server_time_offset = self.enhanced_time_sync.get_synchronized_time(local_time) - local_time;

        if self.debug_mode {
            log::info!(
                "Time sync updated - Confidence: {:.2}, Offset: {}ms",
                self.enhanced_time_sync.get_confidence(),
                self.server_time_offset
            );
        }
    }

    /// Sets the flush callback for adaptive timing
    pub fn set_flush_callback(&mut self, callback: Box<dyn Fn(u32) + Send + 'static>) {
        self.flush_callback = Some(callback);
    }
}
```

### Step 2: Update Message Processing with Monotonic Timing

```rust
use std::time::Instant;

pub struct TimingContext {
    pub message_received_at: Instant,
    pub message_wall_time: f64,
    pub server_time_offset: f64,
}

pub fn handle_ws_midi_message_with_monotonic_timing(
    message: &MidiMessageOutputDto, 
    state: Rc<AppState>
) -> Option<BatchedNoteSchedule> {
    // Create timing context immediately upon message receipt
    let timing_context = TimingContext {
        message_received_at: Instant::now(),
        message_wall_time: chrono::Utc::now().timestamp_millis() as f64,
        server_time_offset: state.audio_process_state.server_time_offset as f64,
    };

    // ... rest of processing using timing_context
}

pub fn calculate_note_timing_with_monotonic(
    message_time: f64,
    timing_context: &TimingContext
) -> f64 {
    // Calculate base delay using wall-clock times (for server sync)
    let server_adjusted_time = message_time + timing_context.server_time_offset;
    let base_delay = server_adjusted_time - timing_context.message_wall_time;
    
    // Account for processing time using monotonic clock
    let processing_delay = timing_context.message_received_at.elapsed().as_millis() as f64;
    
    // Adjust delay to account for processing time
    let adjusted_delay = base_delay - processing_delay;
    
    // Bound to reasonable values
    adjusted_delay.max(0.0).min(5000.0)
}
```

## Benefits of Monotonic Clock Fix

### 1. Eliminates Timing Anomalies
- **No negative delays**: Monotonic clock always progresses forward
- **No extreme jumps**: Duration calculations remain consistent
- **Predictable behavior**: Timing becomes deterministic

### 2. Immune to System Clock Changes
- **NTP synchronization**: No impact on note timing
- **Daylight saving time**: Duration calculations unaffected
- **User clock adjustments**: Note timing remains accurate

### 3. Improved User Experience
- **Consistent rhythm**: No more arrhythmic playback
- **Reliable note delivery**: Notes arrive at expected times
- **Eliminated "missing notes"**: No more extreme scheduling delays

## Implementation Priority

### **CRITICAL - Implement Immediately**

This fix should be the **highest priority** because:

1. **Root Cause**: Addresses fundamental timing issues
2. **High Impact**: Affects every note processed
3. **Low Risk**: Simple, well-understood change
4. **Immediate Benefit**: Users will notice improvement immediately

### Implementation Steps

1. **Update NoteBufferEngine with Integrated Components** (1 hour)
   - Replace `note_buffer_time` with `note_buffer_start: Option<Instant>`
   - Add `note_buffer_wall_time: Option<DateTime<Utc>>`
   - Integrate `EnhancedTimeSync` for server synchronization
   - Integrate `AdaptiveFlushTimer` for intelligent flushing
   - Update `process_message` and `flush_buffer` methods

2. **Update Message Handling with Enhanced Timing** (45 minutes)
   - Create `TimingContext` structure with monotonic clock support
   - Update timing calculations to use enhanced time sync
   - Integrate adaptive flush callbacks
   - Test with clock adjustment scenarios

3. **Integration Testing** (2 hours)
   - Unit tests for monotonic duration calculations
   - Integration tests with EnhancedTimeSync and AdaptiveFlushTimer
   - Tests with simulated clock changes and network conditions
   - Performance testing to ensure no regression

4. **Deployment with Monitoring** (1 hour)
   - Deploy to staging environment
   - Monitor timing metrics and sync confidence levels
   - Verify adaptive flush behavior
   - Deploy to production with comprehensive monitoring

## Testing Strategy

### Unit Tests
```rust
#[test]
fn test_monotonic_duration_calculation_with_enhanced_timing() {
    let mut engine = NoteBufferEngine::new(Box::new(|_| {}));

    // Process first note
    engine.process_message(create_test_note(60));
    assert!(engine.note_buffer_start.is_some());

    // Simulate time passage
    std::thread::sleep(Duration::from_millis(50));

    // Process second note
    engine.process_message(create_test_note(62));

    // Verify delay is approximately 50ms (not affected by wall-clock changes)
    let delay = engine.note_buffer[1].get_delay();
    assert!(delay >= 45.0 && delay <= 55.0);
}

#[test]
fn test_enhanced_time_sync_integration() {
    let mut engine = NoteBufferEngine::new(Box::new(|_| {}));

    // Update server timing
    engine.update_server_timing(50, 1000, 950); // 50ms RTT, server ahead by 50ms

    // Verify enhanced time sync is working
    assert!(engine.enhanced_time_sync.get_confidence() > 0.0);
    assert_eq!(engine.server_time_offset, 50);
}

#[test]
fn test_adaptive_flush_integration() {
    let mut engine = NoteBufferEngine::new(Box::new(|_| {}));
    let flush_called = Arc::new(AtomicBool::new(false));
    let flush_called_clone = flush_called.clone();

    engine.set_flush_callback(Box::new(move |_interval| {
        flush_called_clone.store(true, Ordering::Relaxed);
    }));

    // Process multiple notes to trigger adaptive behavior
    for i in 0..5 {
        engine.process_message(create_test_note(60 + i));
        std::thread::sleep(Duration::from_millis(10));
    }

    // Verify adaptive flush callback was triggered
    assert!(flush_called.load(Ordering::Relaxed));
}

#[test]
fn test_immunity_to_clock_changes() {
    // This test would simulate system clock changes
    // and verify that duration calculations remain accurate
    // while enhanced time sync maintains server synchronization
}
```

### Integration Tests
- Simulate NTP synchronization during note processing with EnhancedTimeSync
- Test adaptive flush behavior under various note activity levels
- Test with daylight saving time transitions
- Verify behavior during system clock adjustments
- Test enhanced time sync confidence levels under different network conditions

## Expected Results

After implementing this integrated fix:

- **Elimination** of negative delay calculations through monotonic clock usage
- **Consistent** note timing regardless of system clock changes
- **Improved** synchronization between players via EnhancedTimeSync
- **Adaptive** flush timing that reduces latency during active playing
- **Higher confidence** time synchronization with jitter compensation
- **Reduced** user reports of timing issues

## Integration Benefits

The combination of monotonic clock fix with EnhancedTimeSync and AdaptiveFlushTimer provides:

1. **Foundational Stability**: Monotonic clock ensures reliable duration calculations
2. **Enhanced Synchronization**: EnhancedTimeSync provides better server time alignment
3. **Intelligent Optimization**: AdaptiveFlushTimer reduces latency when needed
4. **Comprehensive Solution**: Addresses timing issues at multiple levels

This integrated approach should resolve the majority of "slightly delayed notes" and "missing notes" issues by addressing fundamental timing calculation problems while adding intelligent optimizations for real-world performance.
