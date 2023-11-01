export class CreateUserDto {
    name : string;
    id : Number;
    usernmae :string;
    password : string;
    address : string;
    age : number;
  }
  import { IsEmail, IsNotEmpty } from 'class-validator'

export class UserInfo{

@IsNotEmpty({message: 'Please enter a valid name'}) 
name:string;
@IsNotEmpty() 
username:string;
password:string;
address:string;
filename:string;
}


export class UserUpdateInfo{
@IsNotEmpty({message: 'Please enter a valid name'}) 
name:string;
@IsNotEmpty() 
username:string;
password:string;
address:string;
    }