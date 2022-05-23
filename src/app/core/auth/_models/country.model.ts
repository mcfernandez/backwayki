import { BaseModel } from '../../_base/crud';

export class User extends BaseModel {

  id: string;
  name: string;
  description: string;

  clear(): void {
    this.id = '';
    this.name = '';
    this.description = '';
    
  }

}
