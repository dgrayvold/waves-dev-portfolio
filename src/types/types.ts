export interface Project {
	project: string;
	description: string;
	location: string;
	url: string;
	tags: string[];
	image: {
		jpg: string;
		webp?: string;
	};
	cta?: string;
}
