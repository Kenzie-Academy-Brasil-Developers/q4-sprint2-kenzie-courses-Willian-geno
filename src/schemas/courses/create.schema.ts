import * as yup from 'yup';

const courseSchema = yup.object().shape({
	courseName: yup.string().required(),
	duration: yup.string().required(),
});

const courseUpdateSchema = yup.object().shape({
	courseName: yup.string(),
	duration: yup.string(),
});

const serializedCourseSchema = yup.object().shape({
	id: yup.string().uuid().required(),
	courseName: yup.string().required(),
	duration: yup.string().required(),
});

const serialisedCureseUserSchema = yup.object().shape({
	id: yup.string().uuid().required(),
	firstName: yup.string().required(),
	lastName: yup.string().required(),
	idAdm: yup.boolean().optional(),
	createdAt: yup.date().required(),
	updatedAt: yup.date().required(),
	courses: yup.array().of(
		yup.object().shape({
			id: yup.string().uuid().required(),
			courseName: yup.string().required(),
			duration: yup.string().required(),
		})
	),
});

export { courseSchema, serializedCourseSchema, courseUpdateSchema,serialisedCureseUserSchema };
