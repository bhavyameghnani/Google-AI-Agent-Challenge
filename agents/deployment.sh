# ---- Value of CLI options for create trigger command
export TRIGGER_NAME="main-startup-evaluator-trigger" # ---- Change trigger name
export GIT_REPO_NAME="Google-AI-Agent-Challenge"
export GIT_REPO_OWNER="DeveloperDowny"
export BRANCH_PATTERN="^main$"
export BUILD_CONFIG_FILE="agents/cloudbuild.yaml"
export REGION="asia-south1"

# ---- For --service-account CLI option
export PROJECT_ID="" # ---- Change project ID
export SERVICE_ACCOUNT_ID="" # ---- Change service account ID
export SERVICE_ACCOUNT="projects/${PROJECT_ID}/serviceAccounts/${SERVICE_ACCOUNT_ID}"

# ---- Substitution variable values
export SERVICE_NAME="main-startup-evaluator-service-vs1" # ---- Change service name
export ROOT_DIR="agents" # ---- Change name
export GOOGLE_API_KEY="" # ---- Change Google API key
export ARTIFACT_REPO_NAME="startup-evaluator-repo"
export STORAGE_BUCKET="sense-ai-podcasts" # ---- Change storage bucket name
export COMPETITOR_COUNT=2

# ---- For --substitutions CLI option
export SUBSTITUTIONS="_SERVICE_NAME=${SERVICE_NAME},_ROOT_DIR=${ROOT_DIR},_GOOGLE_GENAI_USE_VERTEXAI=false,_GOOGLE_API_KEY=${GOOGLE_API_KEY},_ARTIFACT_REPO_NAME=${ARTIFACT_REPO_NAME},_STORAGE_BUCKET=${STORAGE_BUCKET},_COMPETITOR_COUNT=${COMPETITOR_COUNT}"

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

# ---- Give unauthenticated invoker role to all users for the deployed Cloud Run service
gcloud beta run services add-iam-policy-binding --region=${REGION} --member=allUsers --role=roles/run.invoker ${SERVICE_NAME}
