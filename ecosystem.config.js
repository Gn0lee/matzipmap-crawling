module.exports = {
	apps: [
		{
			name: 'matzipmap-crawling',
			script: 'npm',
			args: 'start',
			instances: 'max',
			exec_mode: 'cluster',
			watch: false,
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
			pre_deploy: 'npm run build', // 배포 전 빌드 실행
		},
	],
};
