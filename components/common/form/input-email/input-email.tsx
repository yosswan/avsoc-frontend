import * as React from 'react';
import { Input } from 'components/common/form/input';
import { InputProps } from 'interfaces/common';

export const InputEmail: React.FC<
	InputProps & React.InputHTMLAttributes<HTMLInputElement>
> = React.memo(({ rules, ...props }) => {
	const mergedRules = React.useMemo(() => ({
		...rules,
		pattern: {
			value: /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/,
			message: 'Invalid email address',
		},
	}), [rules]);
	return (
		<>
			<Input
				type="text"
				rules={mergedRules}
				{...props}
			></Input>
		</>
	);
});
