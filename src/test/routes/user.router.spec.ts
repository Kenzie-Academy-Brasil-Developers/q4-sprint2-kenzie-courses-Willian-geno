import { DataSource } from 'typeorm';
import { AppDataSource } from '../../data-source';
import request from 'supertest';
import app from '../../app';
import uuid from 'uuid';

describe('Testing the user router', () => {
	let connection: DataSource;

	beforeAll(async () => {
		await AppDataSource.initialize()
			.then((res) => (connection = res))
			.catch((err) => {
				console.error('error during Data Source initialization', err);
			});
	});

	afterAll(async () => {
		await connection.destroy();
	});
	test('Should be able to create a new user', async () => {
		const firstName = 'Willian';
		const lastName = 'Gustavo';
		const email = 'ra110059@uem.br';
		const password = '1234';
		const isAdm = true;

		const dataUser = { firstName, lastName, email, password, isAdm };

		const response = await request(app).post('/userS').send(dataUser);

		expect(response.status).toBe(201);
		expect(response.body).toEqual(
			expect.objectContaining({
				id: 1,
				lastName,
				firstName,
				email,
				password,
				isAdm,
				courses: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		);
	});

	test('Should be able to return a list of all registered users', async () => {
		const response = await request(app).get('/users');

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('map');
	});

	/* test('Should be able to return a token', async () => {
		const email = 'ra110059@uem.br';
		const password = '1234';

		const userData = { email, password };

		const response = await request(app).post('/login').send(userData)

		expect(response.status).toBe(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				token:"",
			})
		);
	}); */
});
