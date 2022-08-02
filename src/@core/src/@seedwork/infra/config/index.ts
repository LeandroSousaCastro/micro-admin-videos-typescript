import { config as readEnv } from "dotenv";
import { join } from "path";

type Config = {
  db: {
    vendor: any;
    host: string;
    logging: boolean;
  };
};

function makeConfig(envFile): Config {
  const output = readEnv({ path: envFile });

  return {
    db: {
      vendor: output.parsed.DB_VENDOR || ("sqlite" as any),
      host: output.parsed.DB_HOST || ":memory:",
      logging: output.parsed.DB_LOGGING === "true",
    },
    // mail: {},
    // storage: {},
  };
}

const envTestingFile = join(__dirname, "../../../../.env.test");
export const config = makeConfig(envTestingFile);
