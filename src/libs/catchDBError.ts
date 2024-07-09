import { ValidationError } from 'class-validator';

export default function (err: any) {
    // Handle duplicate key error (this part remains unchanged)
    if (err.code == '23505') { // PostgreSQL unique violation error code
        const detail = err.detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
        if (detail) {
            return `${detail[1]} is taken`;
        }
    }

    // Handle validation errors
    if (Array.isArray(err) && err.every((e: any) => e instanceof ValidationError)) {
        return err.flatMap((e: ValidationError) => extractErrors(e));
    }

    // Handle other types of errors if necessary
    return "An unknown error occurred";
}

function extractErrors(error: ValidationError, parentField = ''): { field: string, message: string }[] {
    let errors: { field: string, message: string }[] = [];

    if (error.constraints) {
        errors.push(...Object.values(error.constraints).map(message => ({
            field: parentField + error.property,
            message
        })));
    }

    if (error.children && error.children.length) {
        error.children.forEach(childError => {
            errors.push(...extractErrors(childError, parentField + error.property + '.'));
        });
    }

    return errors;
}
