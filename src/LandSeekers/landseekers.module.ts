//   @UsePipes(new ValidationPipe())
//   @UseInterceptors(
//     FileInterceptor('profilepic', {
//       fileFilter: (req, file, cb) => {
//         if (file.originalname.match(/\.(jpg|webp|png|jpeg)$/)) {
//           cb(null, true);
//         } else {
//           cb(new BadRequestException('Invalid file format'), false);
//         }
//       },
//       limits: { fileSize: 30000 },
//       storage: diskStorage({
//         destination: './upload',
//         filename: (req, file, cb) => {
//           cb(null, Date.now() + file.originalname);
//         },
//       }),
//     }),
//   )
//   async updateProfile(
//     @Param('id') id: number,
//     @Body() updatedProfile: LandownerProfile,
//     @UploadedFile() profilepic: Express.Multer.File,
//   ): Promise<
//     | { success: boolean; message: string; data: LandownerProfile }
//     | { success: boolean; message: string; error: any }
//   > {
//     try {
//       const result = await this.landownerProfileService.updateProfile(
//         id,
//         updatedProfile,
//         profilepic,
//       );
//       return {
//         success: true,
//         message: 'Profile updated successfully',
//         data: result,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: 'Profile update failed',
//         error: error.message,
//       };
//     }
//   }





// this is for service 
//  async updateProfile(
//     id: number,
//     updatedProfile: LandownerProfile,
//     profilepic: Express.Multer.File,
//   ): Promise<LandownerProfile | null> {
//     const existingProfile = await this.landownerProfileRepository.findOne({
//       where: { landownerid: id },
//     });

//     if (!existingProfile) {
//       throw new Error('Profile not found');
//     }

//     // Update the properties of the existing profile with the new values
//     existingProfile.landownername = updatedProfile.landownername;
//     existingProfile.landownertitle = updatedProfile.landownertitle;
//     existingProfile.landownerusername = updatedProfile.landownerusername;

//     // Check if the password is updated
//     if (updatedProfile.landownerpassword) {
//       const newPassword = updatedProfile.landownerpassword;

//       // Generate a new salt and hash the password
//       const salt = await bcrypt.genSalt();
//       const hashedPassword = await bcrypt.hash(newPassword, salt);

//       // Update the password with the hashed password
//       existingProfile.landownerpassword = hashedPassword;
//     }

//     // Update the profile picture if a new one is provided
//     if (profilepic) {
//       try {
//         const path = join(__dirname, '../../upload', profilepic.filename); // Adjust the path as needed
//         const writeStream = createWriteStream(path);
//         writeStream.write(profilepic.buffer);
//         writeStream.end(); // This is required to close the write stream

//         existingProfile.landownerprofilepic = profilepic.filename;
//       } catch (error) {
//         throw new BadRequestException('Failed to upload profile picture');
//       }
//     }

//     // Save the updated profile in the database
//     return await this.landownerProfileRepository.save(existingProfile);
//   }