import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  // const config = new DocumentBuilder()
  //   .setTitle("Trade Platform API")
  //   .setDescription("Допументация торговой площадки HexTrade")
  //   .setVersion("1.0")
  //   .build();

  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT", 3000);

  // const documentFactory = () => SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup("docs", app, documentFactory);
  await app.listen(port);
}

bootstrap();
