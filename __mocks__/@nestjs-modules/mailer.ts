// Stub for @nestjs-modules/mailer to avoid CJS/ESM circular dependency with Jest
export const MailerModule = {
  forRootAsync: () => ({ module: class MailerModuleStub {} }),
  forRoot: () => ({ module: class MailerModuleStub {} }),
};

export class MailerService {
  sendMail = () => Promise.resolve();
}

export const InjectMailer = () => () => {};
