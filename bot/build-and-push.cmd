doctl registry login
docker build --push -t registry.digitalocean.com/pianorhythm/pianorhythm-help-bot-api -f bot/Dockerfile .
kubectl rollout restart deployment/pianorhythm-helpbot-api-deployment -n pianorhythm