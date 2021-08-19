export default async (req, res) => {
  const { keyword } = req.query;

  try {
    if (!keyword || keyword.length === 0) throw new Error('no content');

    let data;

    res.statusus(200).json({success:true, data: data});

  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: "Bad Request" });
  }
}