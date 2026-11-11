import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Hanya terima method POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { nama_pemesan, no_hp, lokasi_penjemputan, lokasi_tujuan } = req.body;

  try {
    const { data, error } = await supabase
      .from("pemesanan_ambulans")
      .insert([
        {
          nama_pemesan,
          no_hp,
          lokasi_penjemputan,
          lokasi_tujuan,
          status: "Mencari Driver",
        },
      ])
      .select();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Pemesanan berhasil",
      data: data[0],
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
