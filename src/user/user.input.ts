import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserInput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  lastname: string;
}
