export default async function handler(req, res) {
    console.log("リクエスト受信:", req.body); // ← req.bodyの内容を確認

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const GAS_URL = "https://script.google.com/macros/s/AKfycbzQOQb_ZRe9WzjRELQS6SDb7sRHP6h92tEcirk90mQGMsNi41YsrjsmylRmKlx95r8X/exec";
    const data = req.body;

    try {
        const gasRes = await fetch(GAS_URL, {
    	method: "POST",
    	headers: {
       	 "Content-Type": "application/json", // ← 追加
    },
    	body: JSON.stringify(data), // ← URLSearchParamsではなくJSON形式で送信
	});

        const text = await gasRes.text();
        console.log("GASレスポンス:", text);

        try {
            const result = JSON.parse(text);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json({
                message: "GASからのレスポンスがJSONではありません",
                raw: text,
            });
        }
    } catch (err) {
        console.error("Vercel Functionsエラー:", err);
        return res.status(500).json({ message: "Vercel Functionsエラー", error: err.message });
    }
}