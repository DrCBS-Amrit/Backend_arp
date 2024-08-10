const express = require('express');
const path = require('path');
const vulnerabilityRoutes = require('./routes/vulnerabilityRoutes');
const cors=require('cors')



const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/', vulnerabilityRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


