import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('howMany')
    .setDescription(
      '스팀 게임 플레이타임 불러오기, 게임성향 테스트를 통한 게임 추천 등의 기능이 있는 웹사이트',
    )
    .setVersion('2.0.0')
    .addTag('swagger')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(443);
}
bootstrap();
