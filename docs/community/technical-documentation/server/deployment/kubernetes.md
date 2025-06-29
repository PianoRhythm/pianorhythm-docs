---
id: kubernetes-deployment-guide
title: Kubernetes Deployment Guide
description: Scalable Kubernetes deployment with manifests, scaling, and production best practices
path: ['/community/development/technical-documentation/server/deployment/kubernetes']
keywords: ['kubernetes', 'k8s', 'deployment', 'scaling', 'orchestration', 'production', 'manifests', 'pianorhythm']
tags:
  - kubernetes
  - k8s
  - deployment
  - scaling
  - orchestration
  - production
  - manifests
  - devops
---

# Kubernetes Deployment Guide

This guide covers deploying PianoRhythm Server on Kubernetes, including configuration, scaling, and production best practices.

## ☸️ Kubernetes Overview

### Architecture Components
- **Deployments** - Application pods and replica management
- **Services** - Internal and external service discovery
- **Ingress** - External traffic routing and SSL termination
- **ConfigMaps** - Configuration management
- **Secrets** - Sensitive data management
- **StatefulSets** - Database persistence

### Cluster Requirements
- **Kubernetes Version**: 1.24+
- **Node Resources**: 2 CPU, 4GB RAM minimum per node
- **Storage**: Persistent volumes for databases
- **Networking**: CNI plugin (Calico, Flannel, etc.)

## 📁 Kubernetes Manifests Structure

The project includes comprehensive Kubernetes manifests in the `kubernetes/` directory:

```
kubernetes/
├── namespaces/
│   └── pianorhythm.yaml
├── configs/
│   ├── app-config.yaml
│   └── logging-config.yaml
├── secrets/
│   ├── app-secrets.yaml
│   └── tls-secrets.yaml
├── deployments/
│   ├── pianorhythm-server.yaml
│   ├── redis.yaml
│   └── mongodb.yaml
├── services/
│   ├── pianorhythm-service.yaml
│   ├── redis-service.yaml
│   └── mongodb-service.yaml
├── ingresses/
│   └── pianorhythm-ingress.yaml
└── stateful-sets/
    └── mongodb-statefulset.yaml
```

## 🚀 Basic Deployment

### Namespace Creation
```yaml
# kubernetes/namespaces/pianorhythm.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: pianorhythm
  labels:
    name: pianorhythm
    environment: production
```

### Application Deployment
```yaml
# kubernetes/deployments/pianorhythm-server.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pianorhythm-server
  namespace: pianorhythm
  labels:
    app: pianorhythm-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pianorhythm-server
  template:
    metadata:
      labels:
        app: pianorhythm-server
    spec:
      containers:
      - name: pianorhythm-server
        image: pianorhythm-server:latest
        ports:
        - containerPort: 8080
        env:
        - name: RUST_LOG
          value: "info"
        - name: REDIS_URL
          value: "redis://redis-service:6379"
        - name: MONGODB_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: mongodb-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service Configuration
```yaml
# kubernetes/services/pianorhythm-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: pianorhythm-service
  namespace: pianorhythm
spec:
  selector:
    app: pianorhythm-server
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: ClusterIP
```

## 🗄️ Database Deployment

### Redis Deployment
```yaml
# kubernetes/deployments/redis.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: pianorhythm
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        command:
        - redis-server
        - --requirepass
        - $(REDIS_PASSWORD)
        env:
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: redis-password
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        volumeMounts:
        - name: redis-data
          mountPath: /data
      volumes:
      - name: redis-data
        persistentVolumeClaim:
          claimName: redis-pvc
```

### MongoDB StatefulSet
```yaml
# kubernetes/stateful-sets/mongodb-statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongodb
  namespace: pianorhythm
spec:
  serviceName: mongodb-service
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:7
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          value: "admin"
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: mongo-password
        - name: MONGO_INITDB_DATABASE
          value: "pianorhythm"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        volumeMounts:
        - name: mongodb-data
          mountPath: /data/db
  volumeClaimTemplates:
  - metadata:
      name: mongodb-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

## 🔧 Configuration Management

### ConfigMap
```yaml
# kubernetes/configs/app-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: pianorhythm
data:
  server-name: "production"
  rust-log: "info"
  heartbeat-interval: "30s"
  max-connections: "1000"
  app.toml: |
    [server]
    name = "production"
    port = 8080
    
    [redis]
    prefix = "pianorhythm"
    
    [logging]
    level = "info"
    format = "json"
```

### Secrets Management
```yaml
# kubernetes/secrets/app-secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: pianorhythm
type: Opaque
data:
  jwt-secret: <base64-encoded-secret>
  mongodb-url: <base64-encoded-url>
  redis-password: <base64-encoded-password>
  mongo-password: <base64-encoded-password>
  stripe-secret-key: <base64-encoded-key>
  sentry-dsn: <base64-encoded-dsn>
```

## 🌐 Ingress Configuration

### NGINX Ingress
```yaml
# kubernetes/ingresses/pianorhythm-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: pianorhythm-ingress
  namespace: pianorhythm
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
    nginx.ingress.kubernetes.io/websocket-services: pianorhythm-service
spec:
  tls:
  - hosts:
    - api.pianorhythm.io
    secretName: pianorhythm-tls
  rules:
  - host: api.pianorhythm.io
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: pianorhythm-service
            port:
              number: 80
```

## 📊 Monitoring and Observability

### Prometheus ServiceMonitor
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: pianorhythm-metrics
  namespace: pianorhythm
spec:
  selector:
    matchLabels:
      app: pianorhythm-server
  endpoints:
  - port: metrics
    path: /metrics
    interval: 30s
```

### Grafana Dashboard ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: pianorhythm-dashboard
  namespace: monitoring
data:
  dashboard.json: |
    {
      "dashboard": {
        "title": "PianoRhythm Server Metrics",
        "panels": [
          {
            "title": "Active Connections",
            "type": "stat",
            "targets": [
              {
                "expr": "pianorhythm_active_connections"
              }
            ]
          }
        ]
      }
    }
```

## 🔄 Scaling and Updates

### Horizontal Pod Autoscaler
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: pianorhythm-hpa
  namespace: pianorhythm
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: pianorhythm-server
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Rolling Updates
```bash
# Update deployment image
kubectl set image deployment/pianorhythm-server \
  pianorhythm-server=pianorhythm-server:v0.2.1 \
  -n pianorhythm

# Check rollout status
kubectl rollout status deployment/pianorhythm-server -n pianorhythm

# Rollback if needed
kubectl rollout undo deployment/pianorhythm-server -n pianorhythm
```

## 🚀 Deployment Commands

### Initial Deployment
```bash
# Create namespace
kubectl apply -f kubernetes/namespaces/

# Apply secrets (create manually first)
kubectl apply -f kubernetes/secrets/

# Apply configurations
kubectl apply -f kubernetes/configs/

# Deploy databases
kubectl apply -f kubernetes/stateful-sets/
kubectl apply -f kubernetes/deployments/redis.yaml

# Deploy application
kubectl apply -f kubernetes/deployments/pianorhythm-server.yaml

# Create services
kubectl apply -f kubernetes/services/

# Configure ingress
kubectl apply -f kubernetes/ingresses/
```

### Monitoring Deployment
```bash
# Check pod status
kubectl get pods -n pianorhythm

# View logs
kubectl logs -f deployment/pianorhythm-server -n pianorhythm

# Check service endpoints
kubectl get endpoints -n pianorhythm

# Describe resources
kubectl describe deployment pianorhythm-server -n pianorhythm
```

### Maintenance Operations
```bash
# Scale deployment
kubectl scale deployment pianorhythm-server --replicas=5 -n pianorhythm

# Port forward for debugging
kubectl port-forward service/pianorhythm-service 8080:80 -n pianorhythm

# Execute commands in pod
kubectl exec -it deployment/pianorhythm-server -n pianorhythm -- /bin/bash

# Backup database
kubectl exec -it statefulset/mongodb -n pianorhythm -- \
  mongodump --out /tmp/backup
```

## 🔒 Security Best Practices

### Pod Security Standards
```yaml
apiVersion: v1
kind: Pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001
    fsGroup: 1001
  containers:
  - name: pianorhythm-server
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
```

### Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: pianorhythm-network-policy
  namespace: pianorhythm
spec:
  podSelector:
    matchLabels:
      app: pianorhythm-server
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 8080
```

---

This Kubernetes deployment guide provides a production-ready setup for PianoRhythm Server with proper scaling, monitoring, and security configurations.
