import { decode } from 'jsonwebtoken';
import { courseRepository, userRepository } from '../repositories';
import { AssertsShape } from 'yup/lib/object';
import { Course, User } from '../entities';
import nodemailer from 'nodemailer';
import {
	serialisedCureseUserSchema,
	serializedAdminCoursesSchema,
	serializedCourseSchema,
	serializedStudentsCoursesSchema,
} from '../schemas';

class CourseService {
	createCourse = async ({ validated }): Promise<AssertsShape<any>> => {
		const course = await courseRepository.save(validated as Course);
		return await serializedCourseSchema.validate(course, {
			stripUnknown: true,
		});
	};

	readAllCourses = async ({ decoded }): Promise<AssertsShape<any>> => {
		let newList = [];
		const courses = await courseRepository.listAll();
		const loggedUser = await userRepository.retrieve({
			id: decoded.id,
		});
		if (loggedUser.isAdm) {
			for (const element of courses) {
				newList.push({
					id: element.id,
					courseName: element.courseName,
					duration: element.duration,
					students: await element.students,
				});
			}
			return await serializedAdminCoursesSchema.validate(newList, {
				stripUnknown: true,
			});
		}
		return await serializedStudentsCoursesSchema.validate(courses, {
			stripUnknown: true,
		});
	};

	updateCourse = async ({
		validated,
		params,
	}): Promise<AssertsShape<any>> => {
		const course = await courseRepository.update(params.id, {
			...(validated as Course),
		});
		const updatedCourse = await courseRepository.retrieve({
			id: params.id,
		});
		return await serializedCourseSchema.validate(updatedCourse, {
			stripUnknown: true,
		});
	};

	userCourses = async ({
		params,
		headers,
	}): Promise<AssertsShape<any>> => {
		const user = await userRepository.retrieve({
			id: (decode(headers.authorization?.split(' ')[1]) as User).id,
		});

		const course = await courseRepository.retrieve({ id: params.id });

		const newUser = await userRepository.save({
			...user,
			courses: [course],
		});

		const testAccount = await nodemailer.createTestAccount();

		const tansport = nodemailer.createTransport({
			host: process.env.NODEMAILER_HOST,
			port: parseInt(process.env.NODEMAILER_PORT),
			auth: {
				user: process.env.NODEMAILER_USER,
				pass: process.env.NODEMAILER_PASWORD,
			},
		});

		var message = {
			from: process.env.NODEMAILER_USER,
			to: user.email,
			subject: 'Kenzie Cursos',
			text:
				'Ola Sr ' +
				user.lastName +
				', voçê foi cadastrado no curço ' +
				course.courseName +
				' com duração de ' +
				course.duration +
				'! Parabéns',
		};

		tansport.sendMail(message, (err)=> {
			console.log(err)
		})

		return {message:"Email de inscrição enviado com sucesso."}
	};
}

export default new CourseService();
