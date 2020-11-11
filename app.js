const  express = require('express');
const mysql = require('mysql');
const hbs =  require('hbs');
const bodyParser = require('body-parser');

const  app = express();
const port = 8500;

app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var koneksi =  mysql.createConnection({
   host: 'localhost',
   user: 'rizal',
   password: '0000',
   database: 'invent_shop'
});
app.get('/penjualan', (req, res) => {
    res.render( __dirname + '/views/penjualan.hbs');
});

app.get('/pelanggan', (req, res) => {
    res.render( __dirname + '/views/pelanggan.hbs');
});
app.get('/pendapatan', (req, res) => {
    res.render( __dirname + '/views/pendapatan.hbs');
});

koneksi.connect((err) => {
   if(err) throw err;
   console.log("Koneksi Database Berhasil disambung ya boss");
});
//pelanggan
app.get('/', (req, res) => {
    koneksi.query('SELECT * FROM pelanggan', (err, hasil) => {
     if(err) throw err;
     res.render('pelanggan.hbs', {
         halaman1: 'Invent-shop',
         data: hasil
       });
    });
 });

app.post('/pelanggan', (req, res) => {
  var nama = req.body.inputnama;
  var alamat = req.body.inputalamat;
  var telepon = req.body.inputtelepon;  
  koneksi.query('INSERT INTO pelanggan( nama, alamat, telepon) VALUES( ?, ?, ?)',
        [  nama, alamat, telepon ],
            (err, hasil) => {
                if(err) throw err;
                res.redirect('/');
                }
          )
});

app.get('/hapus-pelanggan/:Nama', (req,res) => {
    var nama= req.params.Nama;
    koneksi.query("DELETE FROM pelanggan WHERE  nama = ?",
    [nama], (err, hasil) => {
        if(err) throw err;
        res.redirect('/');
      }
    )
});
//penjualan
app.get('/penjualan', (req, res) => {
    koneksi.query('SELECT * FROM penjualan', (err, hasil) => {
        if(err) throw err;
        res.render('penjualan.hbs',{
            judulhalaman: 'DATA-PENJUALAN',
            data: hasil
        });
    });
});

app.post('/tambah-penjualan', (req, res) =>{
    var nama_barang = req.body.inputnama_barang;
    var jumlah = req.body.inputjumlah;
    var harga = req.body.inputharga;
    koneksi.query('INSERT INTO penjualan(nama_barang, jumlah, harga)values(?,?,?)',
    [nama_barang, jumlah, harga],
    (err, hasil) => {
        if(err) throw err;
        res.redirect('/penjualan');
    }
    )
});

app.get('/hapus-nama_barang/:nama_barang', (req, res) => {
    var nama_barang = req.params.nama_barang;
    koneksi.query("DELETE FROM penjualan WHERE nama_barang=?",
         [nama_barang], (err, hasil) => {
             if(err) throw err;
             res.redirect('/penjualan');
         }
    )
});

//pendapatan
app.get('/pendapatan', (req, res) => {
    koneksi.query('SELECT * FROM pendapatan', (err, hasil) => {
     if(err) throw err;
     res.render('pendapatan.hbs', {
         halaman3: 'Invent-shop',
         data: hasil
       });
    });
 });

app.post('/pendapatan', (req, res) => {
  var keterangan = req.body.inputketerangan;
  var jumlah = req.body.inputjumlah;
  koneksi.query('INSERT INTO pendapatan( keterangan, jumlah ) VALUES( ?, ?)',
        [  keterangan, jumlah ],
            (err, hasil) => {
                if(err) throw err;
                res.redirect('/pendapatan');
                }
          )
});

app.get('/hapus-pendapatan/:id_transaksi', (req,res) => {
    var transaksi = req.params.id_transaksi;
    koneksi.query("DELETE FROM pendapatan WHERE transaksi= ?",
    [transaksi], (err, hasil) => {
        if(err) throw err;
        res.redirect('/');
      }
    )
});

app.listen(port, () => {
    console.log(`App berjalan pada port ${port}`);
});