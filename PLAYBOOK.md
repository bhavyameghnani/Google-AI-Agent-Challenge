# Pre-requisites
- Enable Gemini API

# Firestore Database Setup Guide

- Pre-requisite: Enable Firestore API
- ```bash
  export REGION="asia-south1"
  gcloud firestore databases create --location=${REGION}
  ```
- Change security rules

# Storage Bucket Creation Guide

- ```bash
  export STORAGE_BUCKET="sense-ai-podcasts"
  gcloud storage buckets create gs://${STORAGE_BUCKET} --no-public-access-prevention
  ```

# Deployment Guide

## CI/CD using Cloud Build trigger

### Pre-requisites for creating Cloud Build trigger

1. Enable Identity and Access Management (IAM) API
2. Create a service account with necessary permissions
3. Connect GitHub repository
   - `https://console.cloud.google.com/cloud-build/triggers;region=asia-south1/connect?project=<enter-project-number>`
4. Create artifact repository

   - Check:

     - ```bash

         export PROJECT_ID="<enter-project-id>"
         gcloud artifacts repositories list --project=${PROJECT_ID} --location=all
       ```

   - Create:

     - ```bash

         export ARTIFACT_REPO_NAME="startup-evaluator-repo"
         export REGION="asia-south1"

         gcloud artifacts repositories create ${ARTIFACT_REPO_NAME} --repository-format=docker --location=${REGION}
       ```

5. Allow unauthenticated invocations to Cloud Run service

   - ```bash

       export REGION="asia-south1"

       gcloud beta run services add-iam-policy-binding --region=${REGION} --member=allUsers --role=roles/run.invoker ${SERVICE_NAME}
     ```

#### Create Cloud Build trigger

- ```bash
    # ---- Value of CLI options for create trigger command
    export TRIGGER_NAME="main-startup-evaluator-trigger"
    export GIT_REPO_NAME="Google-AI-Agent-Challenge"
    export GIT_REPO_OWNER="DeveloperDowny"
    export BRANCH_PATTERN="^main$"
    export BUILD_CONFIG_FILE="agents/cloudbuild.yaml"
    export REGION="asia-south1"

    # ---- For --service-account CLI option
    export PROJECT_ID="<enter-appropriate-value-here>"
    export SERVICE_ACCOUNT_ID="<enter-appropriate-value-here>"
    export SERVICE_ACCOUNT="projects/${PROJECT_ID}/serviceAccounts/${SERVICE_ACCOUNT_ID}"

    # ---- Substitution variable values
    export SERVICE_NAME="main-startup-evaluator-service-vs1"
    export ROOT_DIR="agents"
    export GOOGLE_API_KEY="<enter-appropriate-value-here>"
    export ARTIFACT_REPO_NAME="startup-evaluator-repo"

    # ---- For --substitutions CLI option
    export SUBSTITUTIONS="_SERVICE_NAME=${SERVICE_NAME},_ROOT_DIR=${ROOT_DIR},_GOOGLE_GENAI_USE_VERTEXAI=false,_GOOGLE_API_KEY=${GOOGLE_API_KEY},_ARTIFACT_REPO_NAME=${ARTIFACT_REPO_NAME}"

    # ---- Create trigger command with above set env vars passed via CLI options
    gcloud builds triggers create github \
        --name=${TRIGGER_NAME} \
        --repo-name=${GIT_REPO_NAME} \
        --repo-owner=${GIT_REPO_OWNER} \
        --branch-pattern=${BRANCH_PATTERN} \
        --build-config=${BUILD_CONFIG_FILE} \
        --region=${REGION} \
        --service-account=${SERVICE_ACCOUNT} \
        --substitutions=${SUBSTITUTIONS}
  ```

### Delete trigger

- ```bash
      export TRIGGER_NAME="main-startup-evaluator-trigger"
      export REGION="asia-south1"
      gcloud builds triggers delete ${TRIGGER_NAME} --region=${REGION}

  ```
