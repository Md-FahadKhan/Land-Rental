// import { Controller, Post, Body } from '@nestjs/common';

// import * as jwt from 'jsonwebtoken'; // Import the jsonwebtoken library
// import { AdminService } from 'src/Admin/services/admin.service';

// @Controller('admin')
// export class AuthController {
//   constructor(private readonly adminService: AdminService) {}

//   @Post('login')
//   async login(@Body() myobj: { username: string; password: string }) {
//     //const admin = await this.adminService.login(myobj.username, myobj.password);

//     if (admin) {
//       // Generate a JWT token with user information
//       const token = jwt.sign({ username: myobj.username }, 'your-secret-key', {
//         expiresIn: '1h', // Set the token expiration time
//       });
//       return { message: 'success', token }; // Return the token to the client
//     } else {
//       return { message: 'false' };
//     }
//   }
// }
