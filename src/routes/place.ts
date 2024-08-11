import { Router, Request, Response } from 'express';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

const router = Router();

const extractFnameOrReturnOriginal = (url: string): string => {
	try {
		if (!/^https?:\/\//i.test(url)) {
			url = 'https:' + url;
		}

		const urlObj = new URL(url);

		const fname = urlObj.searchParams.get('fname');

		if (fname) {
			return decodeURIComponent(fname);
		} else {
			return url;
		}
	} catch (error) {
		console.error('Invalid URL:', error);
		return url;
	}
};

router.get('/:id', async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const browser = await puppeteer.launch();

		const page = await browser.newPage();

		const kakaoMapUrl = `https://place.map.kakao.com/m/${id}`;

		await page.goto(kakaoMapUrl, { waitUntil: 'networkidle2' });

		await page.waitForSelector('a[data-viewid="basicInfoTopImage"]');

		await page.waitForSelector('span[data-score]');

		await page.waitForSelector('span[data-comntcnt]');

		const content = await page.content();

		const $ = cheerio.load(content);

		const basicInfoTopImageTag = $('a[data-viewid="basicInfoTopImage"]');
		const style = basicInfoTopImageTag.attr('style');
		const mainPhotoKakaoCdnUrl = style?.match(/url\(["']?([^"']+)["']?\)/)?.[1] || '';

		const mainPhotoUrl = extractFnameOrReturnOriginal(mainPhotoKakaoCdnUrl);

		const score = Number($('span[data-score]').text());

		const scoreCount = Number($('span[data-comntcnt]').text());

		res
			.status(200)
			.json({ response: { main_photo_url: mainPhotoUrl, score, score_count: scoreCount, id: Number(id) } });
	} catch (error) {
		console.log(error);

		res.status(500).json({ error: 'Internal server error', code: 'CRW001' });
	}
});

export default router;
