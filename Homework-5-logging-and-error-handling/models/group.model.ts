type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export interface IGroup {
	id: string;
	name: string;
	permissions: Permission[];
}
