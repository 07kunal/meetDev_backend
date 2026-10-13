const {
    SecretsManagerClient,
    GetSecretValueCommand
} = require("@aws-sdk/client-secrets-manager");

const getSecrets = async () => {
    const AWS_KEY = process?.env?.AWS_ACCESS_KEY;
    const AWS_SECRET_KEY = process?.env?.AWS_SECRET_KEY;
    try {
        const client = new SecretsManagerClient({
            region: "ap-south-1",
            credentials: {
                accessKeyId: AWS_KEY,
                secretAccessKey: AWS_SECRET_KEY
            }
        });
        const command = new GetSecretValueCommand({
            SecretId: "meetDev/Secret"
        });

        const response = await client.send(command);

        const secrets = JSON.parse(response.SecretString);
        for (const [key, value] of Object.entries(secrets)) {
            if (value !== null && value !== undefined) {
                process.env[key] = String(value);
            }
        }
        console.log('Secrets loaded from AWS Secrets Manager.', secrets);
        return secrets;
    } catch (error) {
        console.log('exception while getSecret', error);
        throw error;
    }

};
module.exports = { getSecrets };