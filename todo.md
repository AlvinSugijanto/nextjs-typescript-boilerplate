1. benerin typing di use-filters.ts (sekarang di sortOrder nya pun masih string harusnya bisa pakai "asc || desc") (done) (perlu dipahami lebih dalam)
2. sync to url nya masih aneh, bikin kalau misal filter only keyword yang diisi : itu di query params cuma keyword aja
3. error handling message nya belum bener,di console.log() di page ga keluar error nya mostly gara2 use-api.ts error handling nya


use-filter nya masih ga efisien, params page nya saat sync to url nya ga ke update saat ganti page, harusnya page dan perpage masukin ke filter juga