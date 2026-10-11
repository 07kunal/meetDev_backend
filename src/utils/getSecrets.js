const {
    SecretsManagerClient,
    GetSecretValueCommand
} = require("@aws-sdk/client-secrets-manager");

const getSecrets = async () => {
    try {
        const client = new SecretsManagerClient({
            region: "ap-south-1"
        });

        const command = new GetSecretValueCommand({
            SecretId: "meetDev/Secret"
        });

        const response = await client.send(command);

        const secrets = JSON.parse(response.SecretString);
        // for (const [key, value] of Object.entries(secrets)) {
        //     process.env[key] = value;
        // }
        console.log(secrets);
        return secrets;
    } catch (error) {
        process.exit(1);
    }

};
module.exports = { getSecrets };