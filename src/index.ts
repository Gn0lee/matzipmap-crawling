import express from 'express';
import dotenv from 'dotenv';
import placeRouter from './routes/place';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// JSON 파싱 미들웨어
app.use(express.json());

// 라우터 설정
app.use('/place-info', placeRouter);

// 서버 시작
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
