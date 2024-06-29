import bcrypt from 'bcryptjs';
import express from 'express';
import { User } from '../model/user.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import Cloudinary from 'cloudinary'
import { uploader } from '../middleware/cloudinaryUpload.js';
import userRouter from '../routes/user.js';
import { sendEmail } from '../utils/mail.js';
import { verificationMail } from '../utils/verificationmail.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: '1d' });
}

export const register = async (req, res) => {
try {
    const { email, password, fullname } = req.body;
    console.log(email, password);

    if(!email || !password){
        res.status(400).json("please add all field");
    };

    const userExist = await User.findOne({ email });

    if(userExist){
        res.status(400).json('User already exist');
        return;
    }

         
    // continue and hash password

    const salt = 10;
    const genSalt = bcrypt.genSaltSync(salt);
    const hashPassword = await bcrypt.hash(password, genSalt)

    const newuser = await User.create({
        email, password: hashPassword
    })


      console.log(newuser);
      const token = generateToken(newuser._id);
      const user = { email: newuser.email, token, _id: newuser._id };
    // send mail
    
    await sendEmail(email, 'Email Verification', verificationMail(fullname));
  
      res.status(201).json(user);

    
} catch (error) {
    res.status(500).json({ message: error })
    console.log(error)
}
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await User.findOne({ email });
        console.log(userExist)
        if(!userExist){
           res.status(404).json('User does not exist');
           return
        };

        const verifyPassword = await bcrypt.compare(password, userExist.password);

        if(!verifyPassword){
            res.status(400).send('Incorrect Password');
            return
        }

        const token = generateToken(userExist._id);

        res.status(200).json({
            ...userExist,
            token
        })


    } catch (error) {
        res.status(500).json({ message: error })
        console.log(error)
    }
}

export const verifyEmail = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select('-password');
        if(!user){
            res.status(400).json('User does not exist')
        }

        user.isVerified = true;
        await user.save();
        console.log(user);
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error })
        console.log(error)
    }
}

export const editProfile = async(req, res) => {
    try {
          const { fullname, dateOfBirth, handle, address, profession, bio } = req.body;
          console.log('requser  ', req.user);
            
            if(!req.user){
                res.status(404).json('user not found')
            }

          req.user.fullname = fullname;
          req.user.dateOfBirth = dateOfBirth;
          req.user.handle = handle;
          req.user.address = address;
          req.user.profession = profession;
          req.user.bio = bio;
          const token = generateToken(req.user._id);

            if(req.file){
           const filePath = await uploader(req.file.path);           
           req.user.profilePhoto.url = filePath.url;
           req.user.profilePhoto.public_id = filePath.public_id;
           await req.user.save();
           res.status(200).json({ ...req.user, token });

          }else{
            await req.user.save();
            res.status(200).json({ ...req.user, token });
          }
      
    } catch (error) {
        res.status(500).json({ message: error })
        console.log(error)
    }
}

export const recoveryEmailLink = async (req, res) => {
  try {
    const { email } = req.body;
    
    if(!email){
      res.status(400).json('please provide a valid email address');
      return;
    }
    
    const user = await User.findOne({ email });

    if(!user){
      res.status(404).json('User not found');
      return;
    }

    const id = user._id;
      // send email verification
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        logger: true,
        debug: true,
        auth: {
          user: "fredenoch1@gmail.com",
          pass: process.env.GOOGLEAPPPASS,
        },
        tls: {
          rejectUnauthorized: true,
        },
      });

      const link = `http://localhost:3000/password/reset/${id}`;
      const mailOptions = {
        from: "fredenoch1@gmail.com",
        to: email,
        subject: "Reset Your Password",
        html: `<h2>You Can't Remember Your Password </h2>
            <h3>You forgot your password ? don't worry we can help you reset them </h3>
            <h3></h3>
            <p> Click on this link to reset your password ${link} </p>
            <p>Or Click on the button below,to reset your password</p>
             <a href="${link}" >
            <button style="background-color: black; color: white; padding: 5px;" > Reset Password </button>
            </a>
            `,
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (!error) {
        // console.log(info.response)
        }
      });
      console.log('email send ', user)
      res.status(200).json({ message: 'Password Recovery Sent' });


  } catch (error) {
    res.status(500).json({ message: error })
    console.log(error)
  }
}

export const changePassword = async (req, res) => {
  try {
    const { newpassword1 } = req.body;
    console.log("newpassword1  ", newpassword1, req.params.id)
    
    if(!newpassword1){
      res.status(400).json('please provide a password');
      return;
    }
    
    const user = await User.findOne({ _id: req.params.id });

    if(!user){
      res.status(404).json('User not found');
      return;
    }

     const gensalt = bcrypt.genSaltSync(10);
     const hashPassword = await bcrypt.hash(newpassword1, gensalt);
     user.password = hashPassword;
     await user.save();

      res.status(200).json({message: 'Your Password Has Been Successfully Reset, Please Login To Continue'});

  } catch (error) {
    res.status(500).json({ message: error })
    console.log(error)
  }
}

export const followAndUnfollow = async (req, res) => {
  try {
    console.log(req.params);
    // others id 
    const user = await User.findById(req.params.userId);
    // mine
    const me = await User.findById(req.user._id);
    const io = req.app.get('io');
    if(!user){
      res.status(404).json('User not found');
      return;
    }

    if(me._id === user._id){
      console.log('same users ', me._id, ' and ', user._id);
      res.status(400).json('the same users');
      return;
    }
    // req.user._id is the id of the person that wants to follow me

    if(user.followers.includes(req.user._id)){
      console.log('this id exist alreay as ', req.user._id);
      const index = user.followers.findIndex((f) => f.toString() === req.user._id.toString());
      console.log('found other index ', index);
      user.followers.splice(index, 1);
      await user.save();

      if(me.following.includes(user._id)){
        console.log('i exist')
      const indexMe = me.following.findIndex((f) => f.toString() === user._id.toString());
      console.log('found mine index ', indexMe);
      me.following.splice(indexMe, 1);
      await me.save();
      console.log(me.following, user.followers);
      const token = generateToken(me._id);
      console.log('user followed ', me.followers.length, ' user following ', me.following.length);
     return res.status(200).json({
      ...me, token
      });
    }
    }else{
      user.followers.push(req.user._id);
      me.following.push(user._id);
      await user.save();
      await me.save();
      const token = generateToken(me._id);
      // console.log('user followed ', me);
      console.log('user push followed ', me.followers.length, ' user push following ', me.following.length);
      
      // semd to the user that u followed him
      const newNofication = await Notification.create({
          message: `${me.fullname} followed you`,
          sender: me._id,
          receiver: user._id,
      });
      me.notification.push(newNofication._id);
      await me.save();

      const notify = {
        message: `${me.fullname} followed you`,
        sender: me._id,
        receiver: user._id,
      };
      io.emit('foloowed', notify);
      
      res.status(200).json({
        ...me, token
      });
    }

  } catch (error) {
    res.status(500).json({ message: error })
    console.log(error)
  }
}


export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('following');
   
   res.status(200).json({
       following: user.following
   });

  } catch (error) {
    res.status(500).json({ message: error })
    console.log(error)
  }
}

export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('followers');

    res.status(200).json({ followers: user.followers });

  } catch (error) {
    res.status(500).json({ message: error })
    console.log(error);
  }
}

export const getAUser = async (req, res) => {
  try {
    console.log(req.params);
    const user = await User.findById(req.params.userId).populate('posts following followers');
    const token = generateToken(user._id);
    res.status(200).json({
      ...user, token
    });

  } catch (error) {
    res.status(500).json({ message: error })
    console.log(error);
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('posts following followers');
    const token = generateToken(users._id);
    res.status(200).json({
      users
    });

  } catch (error) {
    res.status(500).json({ message: error })
    console.log(error);
  }
}