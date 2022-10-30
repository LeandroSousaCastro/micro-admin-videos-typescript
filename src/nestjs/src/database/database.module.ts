import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONFIG_SCHEMA_TYPE } from 'src/config/config.module';
import { CategorySequelize } from '@fc/micro-videos/category/infra';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async (config: ConfigService<CONFIG_SCHEMA_TYPE>) => {
        if (config.get('DB_VENDOR') === 'sqlite') {
          const models = [CategorySequelize.CategoryModel];
          return {
            dialect: 'sqlite',
            host: config.get('DB_HOST'),
            models,
            autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
            logging: config.get('DB_LOGGING'),
          };
        }
        if (config.get('DB_VENDOR') === 'mysql') {
          return {
            dialect: 'mysql',
            host: config.get('DB_HOST'),
            database: config.get('DB_DATABASE'),
            username: config.get('DB_USERNAME'),
            password: config.get('DB_PASSWORD'),
            port: config.get('DB_PORT'),
            models: [CategorySequelize.CategoryModel],
            autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
            logging: config.get('DB_LOGGING'),
          };
        }
        throw new Error('DB_VENDOR not supported');
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
