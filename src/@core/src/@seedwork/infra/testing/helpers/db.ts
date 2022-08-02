import { config as config } from "#seedwork/infra/config";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Config } from "sequelize/types";

const sequelizeOptions: SequelizeOptions = {
  dialect: config.db.vendor,
  host: config.db.host,
  logging: config.db.logging,
};

export function setupSequelize(options: SequelizeOptions = {}) {
  let _sequelize: Sequelize;

  beforeAll(
    () =>
      (_sequelize = new Sequelize({
        ...sequelizeOptions,
        ...options,
      }))
  );

  beforeEach(async () => {
    await _sequelize.sync({ force: true });
  });

  afterAll(async () => await _sequelize.close());

  return {
    get sequelize(): Sequelize {
      return _sequelize;
    },
  };
}
