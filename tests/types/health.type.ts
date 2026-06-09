export interface MockHealthResponse {
	status: string;
	timestamp: string;
	error?: string;
}

export interface LoginResponse {
	message: string;
	user: {
		id: number;
		email: string;
		name: string;
	}
}

export interface GetUserResponse {
	id: number;
	email: string;
	name: string;
};

export interface LogoutResponse {
	message: string;
};
