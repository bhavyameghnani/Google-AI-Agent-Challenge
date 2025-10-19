## Set env variables to be used later in the commands

export PROJECT_ID=""
export REGION=""
export REPOSITORY_NAME=""
export SERVICE_NAME=""
export GOOGLE_API_KEY=""
export USER_EMAIL=""

## Set project ID

gcloud config set project ${PROJECT_ID}

## Create repository

gcloud artifacts repositories create ${REPOSITORY_NAME} \
    --repository-format=docker \
    --location=${REGION}

## Build

gcloud builds submit --tag asia-south1-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${SERVICE_NAME}

gcloud run deploy $SERVICE_NAME \
    --image=${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${SERVICE_NAME}:latest \
 --platform=managed \
 --allow-unauthenticated \
 --max-instances=1 \
 --set-env-vars="GOOGLE_GENAI_USE_VERTEXAI=FALSE" \
 --set-env-vars="GOOGLE_API_KEY=${GOOGLE_API_KEY}"

## Bookmarks

```
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
--member="user:${SERVICE_ACCOUNT_EMAIL}" \
--role="roles/cloudbuild.builds.editor"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
--member="user:${SERVICE_ACCOUNT_EMAIL}" \
--role="roles/storage.admin"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
--member="user:${SERVICE_ACCOUNT_EMAIL}" \
--role="roles/serviceusage.serviceUsageConsumer"
```

gcloud projects add-iam-policy-binding ${PROJECT_ID} --member='user:${USER_EMAIL}' --role='roles/cloudbuild.builds.editor'

gcloud projects add-iam-policy-binding ${PROJECT_ID} --member='user:${USER_EMAIL}' --role='roles/serviceusage.serviceUsageConsumer'