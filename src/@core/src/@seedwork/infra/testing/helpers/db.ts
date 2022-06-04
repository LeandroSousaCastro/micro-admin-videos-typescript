import { Sequelize, SequelizeOptions } from "sequelize-typescript";

const sequelizeOptions: SequelizeOptions = {
  dialect: "sqlite",
  host: ":memory:",
  logging: false,
};

export function setupSequelize(options: SequelizeOptions = {}) {
  let sequelize: Sequelize;

  beforeAll(
    () =>
      (sequelize = new Sequelize({
        ...sequelizeOptions,
        ...options,
      }))
  );

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => await sequelize.close());

  return { sequelize };
}
