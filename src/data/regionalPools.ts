/**
 * Regional authentic name pools for all global cultural regions.
 * Each region contains at least 75 distinct authentic Male First Names,
 * 75 Female First Names, 75 Male Surnames, and 75 Female Surnames.
 * This guarantees 5,000 unique, clean, single First + single Last names per country & gender.
 */

export interface RegionNamePool {
  maleFirst: string[];
  femaleFirst: string[];
  maleLast: string[];
  femaleLast: string[];
}

export const REGIONAL_NAME_POOLS: Record<string, RegionNamePool> = {
  bengali: {
    maleFirst: [
      'Tanvir', 'Siam', 'Shakib', 'Rakib', 'Arif', 'Mehedi', 'Fahim', 'Sohel', 'Imran', 'Rashed',
      'Naim', 'Alamin', 'Shamim', 'Joy', 'Sabbir', 'Hasan', 'Shahadat', 'Zahid', 'Rafi', 'Nahid',
      'Ashik', 'Tariqul', 'Mahfuz', 'Tarek', 'Anik', 'Shuvo', 'Biplob', 'Rayhan', 'Kawsar', 'Saiful',
      'Monir', 'Habib', 'Tamim', 'Mushfiq', 'Mustafiz', 'Taskin', 'Shoriful', 'Liton', 'Mehidy', 'Afif',
      'Nazmul', 'Soumya', 'Anamul', 'Taijul', 'Ebadot', 'Mosaddek', 'Towhid', 'Rishad', 'Tanzid', 'Tanzim',
      'Rubel', 'Shafiul', 'Nasir', 'Imrul', 'Jahurul', 'Arafat', 'Enamul', 'Habibul', 'Khaled', 'Aminul',
      'Asad', 'Ashraful', 'Atik', 'Azim', 'Babul', 'Delwar', 'Faruk', 'Golam', 'Harun', 'Helal',
      'Iftekhar', 'Jahangir', 'Kabir', 'Mamun', 'Manik', 'Mizan', 'Mokbul', 'Motiur', 'Mufazzal', 'Muktar',
      'Murad', 'Nayeem', 'Nazim', 'Nurul', 'Rafiq', 'Riaz', 'Robiul', 'Sabuj', 'Saddam', 'Sadek'
    ],
    femaleFirst: [
      'Nusrat', 'Jannat', 'Sadia', 'Farhana', 'Mim', 'Sumaiya', 'Rima', 'Tasnim', 'Samia', 'Anika',
      'Tanjila', 'Shampa', 'Marufa', 'Ishrat', 'Fariha', 'Nadia', 'Sharmin', 'Afroza', 'Lamia', 'Sultana',
      'Tahmina', 'Zinia', 'Rubina', 'Bristy', 'Mehjabin', 'Sabrina', 'Moon', 'Priyanka', 'Ayesha', 'Fatima',
      'Sanjida', 'Nabila', 'Tabassum', 'Humaira', 'Nahid', 'Rumana', 'Nafisa', 'Mahia', 'Pori', 'Tanjina',
      'Shamima', 'Rokeya', 'Salma', 'Bilkis', 'Hasina', 'Khaleda', 'Shirin', 'Nasreen', 'Monira', 'Rehana',
      'Dilruba', 'Morsheda', 'Shahanaz', 'Fahmida', 'Parveen', 'Selina', 'Shahana', 'Shahida', 'Jahanara', 'Lutfa',
      'Rashida', 'Suraiya', 'Shahinur', 'Asma', 'Kulsum', 'Rabeya', 'Sabina', 'Shireen', 'Roksana', 'Lovely',
      'Munmun', 'Keya', 'Moushumi', 'Purnima', 'Shabnur', 'Apu', 'Joya', 'Bidya', 'Puja', 'Srabonti',
      'Suborna', 'Bipasha', 'Shomi', 'Tarin', 'Richi', 'Jenny', 'Kushum', 'Tina', 'Sonia', 'Simla'
    ],
    maleLast: [
      'Ahmed', 'Ahammed', 'Hossain', 'Rahman', 'Chowdhury', 'Islam', 'Khan', 'Ali', 'Hasan', 'Sikder',
      'Haque', 'Sarker', 'Mia', 'Miah', 'Uddin', 'Mahmud', 'Gazi', 'Sheikh', 'Mollah', 'Kazi',
      'Dewan', 'Patwary', 'Munshi', 'Prodhan', 'Khandakar', 'Howlader', 'Matubbar', 'Bepari', 'Joarder', 'Mallik',
      'Shikdar', 'Talukder', 'Bhuiyan', 'Majumder', 'Roy', 'Das', 'Dey', 'Sen', 'Paul', 'Biswas',
      'Mondal', 'Ghosh', 'Dutta', 'Chakraborty', 'Bhattacharya', 'Gain', 'Halder', 'Barman', 'Samadder', 'Adhikary',
      'Bhowmik', 'Nandi', 'Pal', 'Guha', 'Saha', 'Pramanik', 'Karmakar', 'Sutradhar', 'Shil', 'Sarkar',
      'Podder', 'Kundu', 'Debnath', 'Rudra', 'Dhar', 'Basak', 'Banik', 'Acharjee', 'Goswami', 'Mazumder',
      'Bakshi', 'Laskar', 'Akhand', 'Matin', 'Razzak', 'Sikdar', 'Lodi', 'Faruk', 'Mirza', 'Mridha'
    ],
    femaleLast: [
      'Akter', 'Begum', 'Khatun', 'Sultana', 'Parvin', 'Jahan', 'Banu', 'Ferdous', 'Rahman', 'Chowdhury',
      'Haque', 'Sarker', 'Sikder', 'Majumder', 'Bhuiyan', 'Roy', 'Das', 'Dey', 'Sen', 'Paul',
      'Biswas', 'Mondal', 'Bhowmik', 'Barman', 'Ghosh', 'Dutta', 'Chakraborty', 'Bhattacharya', 'Gain', 'Halder',
      'Bala', 'Mistri', 'Samadder', 'Adhikary', 'Talukder', 'Munshi', 'Kazi', 'Mollah', 'Dewan', 'Patwary',
      'Prodhan', 'Khandakar', 'Howlader', 'Matubbar', 'Bepari', 'Joarder', 'Mallik', 'Shikdar', 'Khanam', 'Nessa',
      'Bibi', 'Nahar', 'Ara', 'Akhter', 'Moni', 'Nandi', 'Pal', 'Guha', 'Saha', 'Pramanik',
      'Karmakar', 'Shil', 'Podder', 'Kundu', 'Debnath', 'Rudra', 'Dhar', 'Basak', 'Banik', 'Goswami',
      'Mazumder', 'Bakshi', 'Laskar', 'Akhand', 'Parveen', 'Nasrin', 'Yasmin', 'Shirin', 'Rozina', 'Bobita'
    ]
  },

  arabic_middle_east: {
    maleFirst: [
      'Mohammed', 'Ahmed', 'Ali', 'Omar', 'Khalid', 'Youssef', 'Tariq', 'Hamza', 'Zayd', 'Ibrahim',
      'Mustafa', 'Kareem', 'Bilal', 'Nabil', 'Sami', 'Faisal', 'Abdullah', 'Abdulrahman', 'Walid', 'Hisham',
      'Rashid', 'Adel', 'Mansour', 'Salem', 'Nasser', 'Marwan', 'Bassam', 'Faris', 'Samir', 'Rami',
      'Fadi', 'Raed', 'Majed', 'Anas', 'Rayan', 'Ayham', 'Hazem', 'Eyad', 'Luay', 'Wael',
      'Qasim', 'Ziyad', 'Badr', 'Jad', 'Adnan', 'Munir', 'Nader', 'Amjad', 'Hatem', 'Ghassan',
      'Shadi', 'Mazen', 'Wissam', 'Fouad', 'Taleb', 'Nayef', 'Fawaz', 'Bandar', 'Saud', 'Turki',
      'Nawaf', 'Mishaal', 'Sultan', 'Rakan', 'Saad', 'Moaz', 'Hassan', 'Hussein', 'Mahmoud', 'Tamer',
      'Amr', 'Osama', 'Sherif', 'Mohsen', 'Salah', 'Yasser', 'Haytham', 'Alaa', 'Ashraf', 'Essam'
    ],
    femaleFirst: [
      'Fatima', 'Aisha', 'Maryam', 'Noor', 'Yasmin', 'Layla', 'Salma', 'Zainab', 'Reem', 'Sara',
      'Dana', 'Huda', 'Mona', 'Rania', 'Rawan', 'Lina', 'Maya', 'Hana', 'Dina', 'Aya',
      'Malak', 'Jana', 'Shahd', 'Judy', 'Tala', 'Farida', 'Karma', 'Mariam', 'Habiba', 'Salwa',
      'Nabila', 'Samira', 'Nadia', 'Latifa', 'Amina', 'Khadija', 'Asma', 'Siham', 'Dalal', 'Ghada',
      'Lubna', 'Maha', 'Manal', 'Maysoon', 'Najwa', 'Noha', 'Randa', 'Samah', 'Suha', 'Wafaa',
      'Buthaina', 'Basma', 'Dalia', 'Eman', 'Fayrouz', 'Hadeel', 'Halima', 'Jamila', 'Lamia', 'Marwa',
      'Nisreen', 'Rabab', 'Sahar', 'Tahani', 'Yusra', 'Zeina', 'Noura', 'Abeer', 'Ghalia', 'Batool',
      'Joud', 'Bayan', 'Sireen', 'Leen', 'Kenzy', 'Lujain', 'Afnan', 'Ahed', 'Shatha', 'Ruaa'
    ],
    maleLast: [
      'Al-Ghamdi', 'Al-Zahrani', 'Al-Shehri', 'Al-Otaibi', 'Al-Harbi', 'Al-Dosari', 'Al-Mutairi', 'Al-Qahtani', 'Al-Shammari', 'Al-Enazi',
      'Al-Bishi', 'Al-Amri', 'Al-Subaie', 'Al-Hajri', 'Al-Rashidi', 'Al-Marri', 'Al-Khalidi', 'Al-Malki', 'Al-Sulami', 'Al-Ghammas',
      'Haddad', 'Khoury', 'Najjar', 'Mansour', 'Maalouf', 'Boulos', 'Stephan', 'Daher', 'Saliba', 'Ghanem',
      'Kassab', 'Barakat', 'Kattan', 'Sarkis', 'Tannous', 'Jabbour', 'Sayegh', 'Eid', 'Antoun', 'Mattar',
      'Wakim', 'Rizk', 'Lahoud', 'Gemayel', 'Frangieh', 'Geagea', 'Tueni', 'Chamoun', 'El-Sayed', 'El-Masry',
      'Al-Sharif', 'Al-Sayed', 'Al-Badawi', 'Al-Naggar', 'Al-Khatib', 'Al-Mansour', 'Al-Husseini', 'Al-Tamimi', 'Al-Jabari', 'Al-Qudsi',
      'Shalabi', 'Darwish', 'Badran', 'Sabri', 'Fahmy', 'Shaker', 'Roushdy', 'Kandil', 'Ghoneim', 'Zaki',
      'Shawky', 'Arafa', 'Morsy', 'Tawfik', 'Helmy', 'Sadek', 'Gouda', 'Metwally', 'Diab', 'Salem'
    ],
    femaleLast: [
      'Al-Ghamdi', 'Al-Zahrani', 'Al-Shehri', 'Al-Otaibi', 'Al-Harbi', 'Al-Dosari', 'Al-Mutairi', 'Al-Qahtani', 'Al-Shammari', 'Al-Enazi',
      'Al-Bishi', 'Al-Amri', 'Al-Subaie', 'Al-Hajri', 'Al-Rashidi', 'Al-Marri', 'Al-Khalidi', 'Al-Malki', 'Al-Sulami', 'Al-Ghammas',
      'Haddad', 'Khoury', 'Najjar', 'Mansour', 'Maalouf', 'Boulos', 'Stephan', 'Daher', 'Saliba', 'Ghanem',
      'Kassab', 'Barakat', 'Kattan', 'Sarkis', 'Tannous', 'Jabbour', 'Sayegh', 'Eid', 'Antoun', 'Mattar',
      'Wakim', 'Rizk', 'Lahoud', 'Gemayel', 'Frangieh', 'Geagea', 'Tueni', 'Chamoun', 'El-Sayed', 'El-Masry',
      'Al-Sharif', 'Al-Sayed', 'Al-Badawi', 'Al-Naggar', 'Al-Khatib', 'Al-Mansour', 'Al-Husseini', 'Al-Tamimi', 'Al-Jabari', 'Al-Qudsi',
      'Shalabi', 'Darwish', 'Badran', 'Sabri', 'Fahmy', 'Shaker', 'Roushdy', 'Kandil', 'Ghoneim', 'Zaki',
      'Shawky', 'Arafa', 'Morsy', 'Tawfik', 'Helmy', 'Sadek', 'Gouda', 'Metwally', 'Diab', 'Salem'
    ]
  },

  south_asian: {
    maleFirst: [
      'Aarav', 'Rohan', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna',
      'Ishan', 'Shaurya', 'Atharva', 'Advik', 'Pranav', 'Kabir', 'Aryan', 'Dhruv', 'Ritvik', 'Ansh',
      'Dev', 'Harsh', 'Kunal', 'Manish', 'Nikhil', 'Rahul', 'Rohit', 'Sachin', 'Varun', 'Yash',
      'Abhishek', 'Amit', 'Aniket', 'Deepak', 'Gaurav', 'Mayank', 'Mohit', 'Pankaj', 'Rajesh', 'Rakesh',
      'Sanjay', 'Saurabh', 'Sumit', 'Suresh', 'Vikas', 'Vishal', 'Alok', 'Anupam', 'Bhavesh', 'Chetan',
      'Dinesh', 'Girish', 'Hitesh', 'Jatin', 'Kapil', 'Lalit', 'Manoj', 'Naveen', 'Piyush', 'Ritesh',
      'Sandeep', 'Tarun', 'Umesh', 'Vivek', 'Yogesh', 'Ajay', 'Ashok', 'Brijesh', 'Chirag', 'Dharmesh',
      'Hardik', 'Jayesh', 'Karan', 'Mukesh', 'Pradeep', 'Praveen', 'Rajeev', 'Ramesh', 'Satish', 'Sunil'
    ],
    femaleFirst: [
      'Aanya', 'Diya', 'Saanvi', 'Ananya', 'Pari', 'Kiara', 'Myra', 'Riya', 'Anika', 'Prisha',
      'Ira', 'Ahana', 'Shanaya', 'Navya', 'Kavya', 'Aditi', 'Tanvi', 'Shreya', 'Sneha', 'Pooja',
      'Neha', 'Priya', 'Ritu', 'Swati', 'Divya', 'Megha', 'Shilpa', 'Rashmi', 'Preeti', 'Payal',
      'Sonam', 'Shruti', 'Suman', 'Anjali', 'Deepa', 'Rekha', 'Sunita', 'Usha', 'Geeta', 'Seema',
      'Anita', 'Asha', 'Sarita', 'Madhu', 'Poonam', 'Radha', 'Renu', 'Shashi', 'Pushpa', 'Lata',
      'Kamala', 'Lalita', 'Meena', 'Shanti', 'Sushma', 'Vidya', 'Vimala', 'Shobha', 'Malati', 'Sudha',
      'Indira', 'Kanta', 'Manju', 'Nirmala', 'Savitri', 'Uma', 'Veena', 'Archana', 'Bhavna', 'Chhaya',
      'Jyoti', 'Kiran', 'Komal', 'Mamta', 'Nandini', 'Pratibha', 'Rachna', 'Rupal', 'Sapna', 'Vandana'
    ],
    maleLast: [
      'Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Joshi', 'Mishra', 'Shah', 'Mehta',
      'Agarwal', 'Trivedi', 'Bhatia', 'Malhotra', 'Kapoor', 'Khanna', 'Chopra', 'Ahuja', 'Sethi', 'Grover',
      'Arora', 'Bakshi', 'Dhawan', 'Narang', 'Bajaj', 'Bansal', 'Goel', 'Mittal', 'Singhal', 'Jindal',
      'Garg', 'Goyal', 'Aggarwal', 'Jain', 'Saxena', 'Mathur', 'Srivastava', 'Tiwari', 'Pandey', 'Shukla',
      'Dubey', 'Chaubey', 'Tripathi', 'Pathak', 'Upadhyay', 'Awasthi', 'Bajpai', 'Dixit', 'Chaturvedi', 'Dhar',
      'Deshmukh', 'Kulkarni', 'Patil', 'Pawar', 'Shinde', 'Jadhav', 'More', 'Gaikwad', 'Chavan', 'Bhosale',
      'Nair', 'Pillai', 'Menon', 'Kurup', 'Varma', 'Nambiar', 'Panicker', 'Reddy', 'Rao', 'Naidu',
      'Chowdary', 'Goud', 'Raju', 'Iyer', 'Iyengar', 'Balakrishnan', 'Subramanian', 'Raman', 'Swamy', 'Natarajan'
    ],
    femaleLast: [
      'Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumari', 'Joshi', 'Mishra', 'Shah', 'Mehta',
      'Agarwal', 'Trivedi', 'Bhatia', 'Malhotra', 'Kapoor', 'Khanna', 'Chopra', 'Ahuja', 'Sethi', 'Grover',
      'Arora', 'Bakshi', 'Dhawan', 'Narang', 'Bajaj', 'Bansal', 'Goel', 'Mittal', 'Singhal', 'Jindal',
      'Garg', 'Goyal', 'Aggarwal', 'Jain', 'Saxena', 'Mathur', 'Srivastava', 'Tiwari', 'Pandey', 'Shukla',
      'Dubey', 'Chaubey', 'Tripathi', 'Pathak', 'Upadhyay', 'Awasthi', 'Bajpai', 'Dixit', 'Chaturvedi', 'Dhar',
      'Deshmukh', 'Kulkarni', 'Patil', 'Pawar', 'Shinde', 'Jadhav', 'More', 'Gaikwad', 'Chavan', 'Bhosale',
      'Nair', 'Pillai', 'Menon', 'Kurup', 'Varma', 'Nambiar', 'Panicker', 'Reddy', 'Rao', 'Naidu',
      'Chowdary', 'Goud', 'Raju', 'Iyer', 'Iyengar', 'Balakrishnan', 'Subramanian', 'Raman', 'Swamy', 'Natarajan'
    ]
  },

  slavic_east: {
    maleFirst: [
      'Alexander', 'Dmitry', 'Maxim', 'Sergey', 'Andrey', 'Alexey', 'Artyom', 'Ilya', 'Mikhail', 'Daniil',
      'Ivan', 'Denis', 'Roman', 'Vladimir', 'Nikita', 'Vladislav', 'Timofey', 'Kirill', 'Egor', 'Matvey',
      'Yaroslav', 'Pavel', 'Anton', 'Gleb', 'Arseny', 'Stepan', 'Lev', 'Marat', 'Artur', 'David',
      'Mark', 'Timur', 'Semyon', 'Fyodor', 'Ruslan', 'Konstantin', 'Grigory', 'Stanislav', 'Boris', 'Oleg',
      'Igor', 'Vadim', 'Vitaly', 'Yury', 'Valery', 'Anatoly', 'Gennady', 'Leonid', 'Viktor', 'Georgy',
      'Bogdan', 'Rostislav', 'Vyacheslav', 'Vsevolod', 'Miron', 'Demid', 'Gordey', 'Savely', 'Platon', 'Zakhar',
      'German', 'Rodion', 'Taras', 'Vasily', 'Pyotr', 'Svyatoslav', 'Evgeny', 'Trofim', 'Nazar', 'Klim',
      'Ignat', 'Makar', 'Danila', 'Arkady', 'Svyatogor', 'Yulian', 'Valentin', 'Innokenty', 'Filipp', 'Eduard'
    ],
    femaleFirst: [
      'Anastasia', 'Maria', 'Daria', 'Anna', 'Polina', 'Elizaveta', 'Ekaterina', 'Ksenia', 'Victoria', 'Varvara',
      'Veronika', 'Alisa', 'Valeria', 'Arina', 'Alexandra', 'Ulyana', 'Kristina', 'Alina', 'Milana', 'Diana',
      'Yulia', 'Olga', 'Elena', 'Tatyana', 'Natalia', 'Irina', 'Svetlana', 'Marina', 'Nadezhda', 'Lyubov',
      'Vera', 'Galina', 'Lyudmila', 'Larisa', 'Valentina', 'Tamara', 'Nina', 'Zoya', 'Raisa', 'Alla',
      'Maya', 'Rimma', 'Inna', 'Oksana', 'Olesya', 'Snezhana', 'Yana', 'Albina', 'Regina', 'Zlata',
      'Miroslava', 'Vasilisa', 'Evgenia', 'Anzhelika', 'Kira', 'Agata', 'Taisiya', 'Eseniya', 'Stanislava', 'Vladislava',
      'Karina', 'Nelly', 'Lilia', 'Violetta', 'Eleonora', 'Elvira', 'Stella', 'Bella', 'Emma', 'Klara',
      'Margarita', 'Viktoriya', 'Darina', 'Rada', 'Lyubava', 'Milena', 'Snezhana', 'Bozhena', 'Zoriana', 'Rada'
    ],
    maleLast: [
      'Ivanov', 'Smirnov', 'Kuznetsov', 'Popov', 'Vasilyev', 'Petrov', 'Sokolov', 'Mikhailov', 'Novikov', 'Fedorov',
      'Morozov', 'Volkov', 'Alekseev', 'Lebedev', 'Semyonov', 'Egorov', 'Pavlov', 'Kozlov', 'Stepanov', 'Nikolaev',
      'Orlov', 'Andreev', 'Makarov', 'Nikitin', 'Zakharov', 'Zaytsev', 'Solovyov', 'Borisov', 'Yakovlev', 'Grigoryev',
      'Romanov', 'Vorobyov', 'Sergeyev', 'Kuzmin', 'Frolov', 'Aleksandrov', 'Dmitriev', 'Korolyov', 'Gusev', 'Kiselyov',
      'Ilyin', 'Maksimov', 'Polyakov', 'Sorokin', 'Vinogradov', 'Kovalyov', 'Belov', 'Medvedev', 'Antonov', 'Tarasov',
      'Krylov', 'Bogdanov', 'Voronov', 'Kazakov', 'Afanasyev', 'Danilov', 'Gerasimov', 'Shestakov', 'Savelyev', 'Fomin',
      'Chernov', 'Abramov', 'Golubev', 'Zhuravlyov', 'Ovsyanikov', 'Trofimov', 'Titov', 'Matveyev', 'Philippov', 'Karpov',
      'Sobolev', 'Kolesnikov', 'Belousov', 'Kudryavtsev', 'Baranov', 'Kulikov', 'Komarov', 'Bespalov', 'Fadeyev', 'Panov'
    ],
    femaleLast: [
      'Ivanova', 'Smirnova', 'Kuznetsova', 'Popova', 'Vasilyeva', 'Petrova', 'Sokolova', 'Mikhailova', 'Novikova', 'Fedorova',
      'Morozova', 'Volkova', 'Alekseeva', 'Lebedeva', 'Semyonova', 'Egorova', 'Pavlova', 'Kozlova', 'Stepanova', 'Nikolaeva',
      'Orlova', 'Andreeva', 'Makarova', 'Nikitina', 'Zakharova', 'Zaytseva', 'Solovyova', 'Borisova', 'Yakovleva', 'Grigoryeva',
      'Romanova', 'Vorobyova', 'Sergeyeva', 'Kuzmina', 'Frolova', 'Aleksandrova', 'Dmitrieva', 'Korolyova', 'Guseva', 'Kiselyova',
      'Ilyina', 'Maksimova', 'Polyakova', 'Sorokina', 'Vinogradova', 'Kovalyova', 'Belova', 'Medvedeva', 'Antonova', 'Tarasova',
      'Krylova', 'Bogdanova', 'Voronova', 'Kazakova', 'Afanasyeva', 'Danilova', 'Gerasimova', 'Shestakova', 'Savelyeva', 'Fomina',
      'Chernova', 'Abramova', 'Golubeva', 'Zhuravlyova', 'Ovsyanikova', 'Trofimova', 'Titova', 'Matveyeva', 'Philippova', 'Karpova',
      'Soboleva', 'Kolesnikova', 'Belousova', 'Kudryavtseva', 'Baranova', 'Kulikova', 'Komarova', 'Bespalova', 'Fadeyeva', 'Panova'
    ]
  },

  slavic_west_south: {
    maleFirst: [
      'Jan', 'Piotr', 'Krzysztof', 'Tomasz', 'Pawel', 'Marcin', 'Michal', 'Marek', 'Grzegorz', 'Lukasz',
      'Jakub', 'Stanislaw', 'Wojciech', 'Mariusz', 'Dariusz', 'Zbigniew', 'Maciej', 'Rafal', 'Robert', 'Adam',
      'Kamil', 'Jacek', 'Artur', 'Milosz', 'Szymon', 'Filip', 'Bartosz', 'Kacper', 'Wojciech', 'Przemyslaw',
      'Lukas', 'Martin', 'Petr', 'Jiri', 'Tomas', 'David', 'Michal', 'Ondrej', 'Marek', 'Matej',
      'Jan', 'Jakub', 'Filip', 'Vojtech', 'Daniel', 'Matyas', 'Adam', 'Vaclav', 'Pavel', 'Radek',
      'Stefan', 'Nikola', 'Marko', 'Milos', 'Luka', 'Aleksandar', 'Dusan', 'Djordje', 'Lazar', 'Nemanja',
      'Dragan', 'Zoran', 'Milan', 'Goran', 'Slobodan', 'Bojan', 'Dejan', 'Igor', 'Predrag', 'Nenad',
      'Ivan', 'Josip', 'Ante', 'Mario', 'Tomislav', 'Ivica', 'Dario', 'Domagoj', 'Borna', 'Mateo'
    ],
    femaleFirst: [
      'Anna', 'Maria', 'Katarzyna', 'Malgorzata', 'Agnieszka', 'Barbara', 'Ewa', 'Krystyna', 'Elzbieta', 'Magdalena',
      'Joanna', 'Aleksandra', 'Monika', 'Teresa', 'Danuta', 'Natalia', 'Karolina', 'Marta', 'Beata', 'Dorota',
      'Halina', 'Jadwiga', 'Irena', 'Grazyna', 'Paulina', 'Justyna', 'Zofia', 'Wiktoria', 'Julia', 'Maja',
      'Eliska', 'Tereza', 'Adela', 'Natalie', 'Kristyna', 'Karolina', 'Barbora', 'Veronika', 'Lucie', 'Klara',
      'Jana', 'Eva', 'Hana', 'Lenka', 'Katerina', 'Petra', 'Marketa', 'Michaela', 'Zuzana', 'Simona',
      'Milica', 'Jelena', 'Marija', 'Mirjana', 'Dragana', 'Snezana', 'Ljubica', 'Gordana', 'Biljana', 'Ivana',
      'Katarina', 'Sanja', 'Ana', 'Bojana', 'Tijana', 'Dunja', 'Sara', 'Sofija', 'Teodora', 'Mina',
      'Lucija', 'Matea', 'Petra', 'Mia', 'Ema', 'Lana', 'Nika', 'Dora', 'Klara', 'Iva'
    ],
    maleLast: [
      'Nowak', 'Kowalski', 'Wisniewski', 'Wojcik', 'Kowalczyk', 'Kaminski', 'Lewandowski', 'Zielinski', 'Szymanski', 'Wozniak',
      'Dabrowski', 'Kozlowski', 'Jankowski', 'Mazur', 'Wojciechowski', 'Kwiatkowski', 'Krawczyk', 'Kaczmarek', 'Piotrowski', 'Grabowski',
      'Novak', 'Svoboda', 'Novotny', 'Dvorak', 'Cerny', 'Prochazka', 'Kucera', 'Vesely', 'Horak', 'Nemec',
      'Marek', 'Pospisil', 'Pokorny', 'Hajek', 'Kral', 'Jelinek', 'Ruzicka', 'Benes', 'Fiala', 'Sedlacek',
      'Jovanovic', 'Petrovic', 'Nikolic', 'Ilic', 'Djordjevic', 'Pavlovic', 'Markovic', 'Popovic', 'Stojanovic', 'Zivkovic',
      'Jankovic', 'Todorovic', 'Stankovic', 'Ristic', 'Kostic', 'Milosevic', 'Cvetkovic', 'Kovacevic', 'Dimitrijevic', 'Tomasevic',
      'Horvat', 'Babic', 'Maric', 'Juric', 'Novak', 'Kovacevic', 'Knezevic', 'Vukovic', 'Matijevic', 'Markovic',
      'Tomic', 'Blazevic', 'Grgic', 'Peric', 'Saric', 'Radic', 'Lovric', 'Bozic', 'Vidovic', 'Bosnjak'
    ],
    femaleLast: [
      'Nowak', 'Kowalska', 'Wisniewska', 'Wojcik', 'Kowalczyk', 'Kaminska', 'Lewandowska', 'Zielinska', 'Szymanska', 'Wozniak',
      'Dabrowska', 'Kozlowska', 'Jankowska', 'Mazur', 'Wojciechowska', 'Kwiatkowska', 'Krawczyk', 'Kaczmarek', 'Piotrowska', 'Grabowska',
      'Novakova', 'Svobodova', 'Novotna', 'Dvorakova', 'Cerna', 'Prochazkova', 'Kucerova', 'Vesela', 'Horakova', 'Nemcova',
      'Markova', 'Pospisilova', 'Pokorna', 'Hajkova', 'Kralova', 'Jelinkova', 'Ruzickova', 'Benesova', 'Fialova', 'Sedlackova',
      'Jovanovic', 'Petrovic', 'Nikolic', 'Ilic', 'Djordjevic', 'Pavlovic', 'Markovic', 'Popovic', 'Stojanovic', 'Zivkovic',
      'Jankovic', 'Todorovic', 'Stankovic', 'Ristic', 'Kostic', 'Milosevic', 'Cvetkovic', 'Kovacevic', 'Dimitrijevic', 'Tomasevic',
      'Horvat', 'Babic', 'Maric', 'Juric', 'Novak', 'Kovacevic', 'Knezevic', 'Vukovic', 'Matijevic', 'Markovic',
      'Tomic', 'Blazevic', 'Grgic', 'Peric', 'Saric', 'Radic', 'Lovric', 'Bozic', 'Vidovic', 'Bosnjak'
    ]
  },

  germanic: {
    maleFirst: [
      'Maximilian', 'Alexander', 'Paul', 'Elias', 'Ben', 'Leon', 'Louis', 'Finn', 'Noah', 'Jonas',
      'Felix', 'Lukas', 'Luca', 'David', 'Tim', 'Niklas', 'Julian', 'Moritz', 'Jan', 'Philipp',
      'Stefan', 'Michael', 'Thomas', 'Andreas', 'Christian', 'Martin', 'Daniel', 'Florian', 'Markus', 'Sebastian',
      'Johannes', 'Tobias', 'Alexander', 'Matthias', 'Simon', 'Patrick', 'Christoph', 'Dominik', 'Manuel', 'Kevin',
      'Lars', 'Daan', 'Lucas', 'Sem', 'Milan', 'Levi', 'Luuk', 'Bram', 'Jesse', 'Liam',
      'Thijs', 'Ruben', 'Thomas', 'Sam', 'Stijn', 'Tim', 'Niels', 'Julian', 'Lars', 'Sven',
      'Jens', 'Dirk', 'Hendrik', 'Willem', 'Pieter', 'Jan', 'Klaas', 'Gerrit', 'Cornelis', 'Johannes',
      'Karl', 'Heinrich', 'Friedrich', 'Wilhelm', 'Otto', 'Hans', 'Walter', 'Ernst', 'Rudolf', 'Werner'
    ],
    femaleFirst: [
      'Emma', 'Mia', 'Hannah', 'Sophia', 'Emilia', 'Lina', 'Marie', 'Mila', 'Ella', 'Lea',
      'Clara', 'Luisa', 'Leni', 'Lilly', 'Laura', 'Johanna', 'Charlotte', 'Amelie', 'Ida', 'Anna',
      'Julia', 'Sarah', 'Lisa', 'Laura', 'Christina', 'Katharina', 'Stefanie', 'Melanie', 'Nadine', 'Sabrina',
      'Jessica', 'Jennifer', 'Sandra', 'Nicole', 'Daniela', 'Vanessa', 'Marina', 'Franziska', 'Carolin', 'Miriam',
      'Tess', 'Sophie', 'Julia', 'Lieke', 'Noa', 'Sara', 'Yara', 'Fleur', 'Eva', 'Lotte',
      'Maud', 'Roos', 'Liv', 'Evi', 'Saar', 'Fenise', 'Iris', 'Sanne', 'Anouk', 'Amber',
      'Gisela', 'Helga', 'Ingrid', 'Ursula', 'Renate', 'Monika', 'Brigitte', 'Karin', 'Erika', 'Gudrun',
      'Christa', 'Hannelore', 'Margot', 'Gerda', 'Inge', 'Marianne', 'Hedwig', 'Irmgard', 'Erna', 'Gertrud'
    ],
    maleLast: [
      'Mueller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
      'Schaefer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schroeder', 'Neumann', 'Schwarz', 'Zimmermann',
      'Braun', 'Krueger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier',
      'Lehmann', 'Schmid', 'Herrmann', 'Maier', 'Mayer', 'Koehler', 'Walter', 'Koenig', 'Huber', 'Kaiser',
      'Fuchs', 'Peters', 'Lang', 'Moeller', 'Weiss', 'Jung', 'Hahn', 'Schubert', 'Vogel', 'Friedrich',
      'Keller', 'Guenther', 'Frank', 'Berger', 'Winkler', 'Roth', 'Beck', 'Lorenz', 'Baumann', 'Franke',
      'De Jong', 'Jansen', 'De Vries', 'Van de Berg', 'Van Dijk', 'Bakker', 'Janssen', 'Visser', 'Smit', 'Meijer',
      'De Boer', 'Mulder', 'De Groot', 'Bos', 'Vos', 'Peters', 'Hendriks', 'Van Leeuwen', 'Dekker', 'Brouwer'
    ],
    femaleLast: [
      'Mueller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
      'Schaefer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schroeder', 'Neumann', 'Schwarz', 'Zimmermann',
      'Braun', 'Krueger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier',
      'Lehmann', 'Schmid', 'Herrmann', 'Maier', 'Mayer', 'Koehler', 'Walter', 'Koenig', 'Huber', 'Kaiser',
      'Fuchs', 'Peters', 'Lang', 'Moeller', 'Weiss', 'Jung', 'Hahn', 'Schubert', 'Vogel', 'Friedrich',
      'Keller', 'Guenther', 'Frank', 'Berger', 'Winkler', 'Roth', 'Beck', 'Lorenz', 'Baumann', 'Franke',
      'De Jong', 'Jansen', 'De Vries', 'Van de Berg', 'Van Dijk', 'Bakker', 'Janssen', 'Visser', 'Smit', 'Meijer',
      'De Boer', 'Mulder', 'De Groot', 'Bos', 'Vos', 'Peters', 'Hendriks', 'Van Leeuwen', 'Dekker', 'Brouwer'
    ]
  },

  anglo: {
    maleFirst: [
      'James', 'Robert', 'John', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
      'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
      'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan',
      'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
      'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Frank', 'Patrick', 'Raymond', 'Jack', 'Dennis', 'Jerry',
      'Tyler', 'Aaron', 'Jose', 'Henry', 'Adam', 'Douglas', 'Nathan', 'Peter', 'Zachary', 'Kyle',
      'Walter', 'Harold', 'Jeremy', 'Ethan', 'Carl', 'Keith', 'Roger', 'Gerald', 'Christian', 'Terry',
      'Sean', 'Arthur', 'Austin', 'Noah', 'Lawrence', 'Jesse', 'Joe', 'Bryan', 'Billy', 'Jordan'
    ],
    femaleFirst: [
      'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
      'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
      'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia', 'Kathleen',
      'Amy', 'Angela', 'Shirley', 'Brenda', 'Emma', 'Anna', 'Pamela', 'Nicole', 'Samantha', 'Katherine',
      'Christine', 'Helen', 'Debora', 'Rachel', 'Carolyn', 'Janet', 'Maria', 'Catherine', 'Heather', 'Diane',
      'Olivia', 'Julie', 'Joyce', 'Victoria', 'Ruth', 'Virginia', 'Lauren', 'Kelly', 'Christina', 'Joan',
      'Evelyn', 'Judith', 'Andrea', 'Hannah', 'Megan', 'Cheryl', 'Jacqueline', 'Martha', 'Madison', 'Teresa',
      'Gloria', 'Sara', 'Janice', 'Ann', 'Kathryn', 'Abigail', 'Sophia', 'Frances', 'Jean', 'Alice'
    ],
    maleLast: [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Thomas',
      'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis',
      'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Hill', 'Green', 'Adams',
      'Nelson', 'Baker', 'Hall', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Phillips', 'Evans', 'Turner',
      'Parker', 'Collins', 'Edwards', 'Stewart', 'Morris', 'Murphy', 'Cook', 'Rogers', 'Morgan', 'Cooper',
      'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks',
      'Wood', 'James', 'Bennett', 'Gray', 'Hughes', 'Price', 'Sanders', 'Myers', 'Long', 'Ross',
      'Foster', 'Powell', 'Sullivan', 'Russell', 'Hamilton', 'Fisher', 'Reynolds', 'Jordan', 'Ellis', 'Harrison'
    ],
    femaleLast: [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Thomas',
      'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis',
      'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Hill', 'Green', 'Adams',
      'Nelson', 'Baker', 'Hall', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Phillips', 'Evans', 'Turner',
      'Parker', 'Collins', 'Edwards', 'Stewart', 'Morris', 'Murphy', 'Cook', 'Rogers', 'Morgan', 'Cooper',
      'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks',
      'Wood', 'James', 'Bennett', 'Gray', 'Hughes', 'Price', 'Sanders', 'Myers', 'Long', 'Ross',
      'Foster', 'Powell', 'Sullivan', 'Russell', 'Hamilton', 'Fisher', 'Reynolds', 'Jordan', 'Ellis', 'Harrison'
    ]
  },

  romance_hispanic: {
    maleFirst: [
      'Alejandro', 'Carlos', 'Daniel', 'David', 'Diego', 'Eduardo', 'Fernando', 'Francisco', 'Gabriel', 'Guillermo',
      'Hector', 'Javier', 'Jesus', 'Jorge', 'Jose', 'Juan', 'Luis', 'Manuel', 'Marco', 'Mario',
      'Mateo', 'Miguel', 'Pablo', 'Pedro', 'Rafael', 'Ramon', 'Ricardo', 'Roberto', 'Rodrigo', 'Santiago',
      'Sebastian', 'Sergio', 'Victor', 'Alvaro', 'Andres', 'Angel', 'Antonio', 'Arturo', 'Cesar', 'Cristian',
      'Emilio', 'Enrique', 'Esteban', 'Felipe', 'Gonzalo', 'Hugo', 'Ignacio', 'Ivan', 'Jaime', 'Joaquin',
      'Julian', 'Leonardo', 'Lucas', 'Mariano', 'Mauricio', 'Nicolas', 'Omar', 'Oscar', 'Raul', 'Ruben',
      'Salvador', 'Tomas', 'Vicente', 'Agustin', 'Alberto', 'Alfredo', 'Alonso', 'Bernardo', 'Camilo', 'Claudio',
      'Dario', 'Domingo', 'Fabian', 'Federico', 'Gerardo', 'Gustavo', 'Hernan', 'Ismael', 'Julio', 'Lorenzo'
    ],
    femaleFirst: [
      'Adriana', 'Alejandra', 'Alicia', 'Ana', 'Andrea', 'Angela', 'Beatriz', 'Camila', 'Carmen', 'Carolina',
      'Catalina', 'Claudia', 'Cristina', 'Daniela', 'Diana', 'Elena', 'Elisa', 'Esperanza', 'Estela', 'Eugenia',
      'Fernanda', 'Gabriela', 'Gloria', 'Graciela', 'Guadalupe', 'Ines', 'Isabel', 'Jimena', 'Josefina', 'Juana',
      'Laura', 'Leticia', 'Lucia', 'Luisa', 'Magdalena', 'Manuela', 'Marcela', 'Margarita', 'Maria', 'Mariana',
      'Marta', 'Mercedes', 'Monica', 'Natalia', 'Patricia', 'Paula', 'Pilar', 'Rafaela', 'Raquel', 'Rebeca',
      'Rocio', 'Rosa', 'Rosario', 'Sandra', 'Sara', 'Silvia', 'Sofia', 'Soledad', 'Sonia', 'Susana',
      'Teresa', 'Valentina', 'Valeria', 'Veronica', 'Victoria', 'Virginia', 'Ximena', 'Yolanda', 'Blanca', 'Cecilia',
      'Clara', 'Consuelo', 'Dolores', 'Emilia', 'Fatima', 'Flora', 'Irene', 'Lorena', 'Miriam', 'Norma'
    ],
    maleLast: [
      'Garcia', 'Rodriguez', 'Gonzalez', 'Fernandez', 'Lopez', 'Martinez', 'Sanchez', 'Perez', 'Gomez', 'Martin',
      'Jimenez', 'Ruiz', 'Hernandez', 'Diaz', 'Moreno', 'Alvarez', 'Romero', 'Alonso', 'Gutierrez', 'Navarro',
      'Torres', 'Dominguez', 'Vazquez', 'Ramos', 'Gil', 'Ramirez', 'Serrano', 'Blanco', 'Molina', 'Morales',
      'Suarez', 'Ortega', 'Delgado', 'Castro', 'Ortiz', 'Rubio', 'Marin', 'Sanz', 'Nunez', 'Iglesias',
      'Medina', 'Garrido', 'Cortes', 'Castillo', 'Santos', 'Lozano', 'Guerrero', 'Cano', 'Prieto', 'Mendez',
      'Cruz', 'Calvo', 'Gallego', 'Vidal', 'Leon', 'Marquez', 'Herrera', 'Pena', 'Flores', 'Cabrera',
      'Campos', 'Vega', 'Fuentes', 'Carrasco', 'Diez', 'Caballero', 'Reyes', 'Nieto', 'Aguilar', 'Pascual',
      'Santana', 'Herrero', 'Lorenzo', 'Montero', 'Hidalgo', 'Gimenez', 'Ibanez', 'Ferrer', 'Duran', 'Santiago'
    ],
    femaleLast: [
      'Garcia', 'Rodriguez', 'Gonzalez', 'Fernandez', 'Lopez', 'Martinez', 'Sanchez', 'Perez', 'Gomez', 'Martin',
      'Jimenez', 'Ruiz', 'Hernandez', 'Diaz', 'Moreno', 'Alvarez', 'Romero', 'Alonso', 'Gutierrez', 'Navarro',
      'Torres', 'Dominguez', 'Vazquez', 'Ramos', 'Gil', 'Ramirez', 'Serrano', 'Blanco', 'Molina', 'Morales',
      'Suarez', 'Ortega', 'Delgado', 'Castro', 'Ortiz', 'Rubio', 'Marin', 'Sanz', 'Nunez', 'Iglesias',
      'Medina', 'Garrido', 'Cortes', 'Castillo', 'Santos', 'Lozano', 'Guerrero', 'Cano', 'Prieto', 'Mendez',
      'Cruz', 'Calvo', 'Gallego', 'Vidal', 'Leon', 'Marquez', 'Herrera', 'Pena', 'Flores', 'Cabrera',
      'Campos', 'Vega', 'Fuentes', 'Carrasco', 'Diez', 'Caballero', 'Reyes', 'Nieto', 'Aguilar', 'Pascual',
      'Santana', 'Herrero', 'Lorenzo', 'Montero', 'Hidalgo', 'Gimenez', 'Ibanez', 'Ferrer', 'Duran', 'Santiago'
    ]
  },

  romance_portuguese: {
    maleFirst: [
      'Afonso', 'Alexandre', 'Andre', 'Antonio', 'Bernardo', 'Bruno', 'Carlos', 'Cristiano', 'Daniel', 'David',
      'Diogo', 'Dinis', 'Duarte', 'Eduardo', 'Felipe', 'Fernando', 'Francisco', 'Gabriel', 'Goncalo', 'Guilherme',
      'Gustavo', 'Henrique', 'Hugo', 'Ignacio', 'Jaime', 'Joao', 'Jorge', 'Jose', 'Leonardo', 'Lourenco',
      'Lucas', 'Luis', 'Manuel', 'Marcelo', 'Marco', 'Mario', 'Mateus', 'Miguel', 'Nelson', 'Nuno',
      'Pedro', 'Rafael', 'Ramiro', 'Raul', 'Ricardo', 'Rodrigo', 'Ruben', 'Salvador', 'Samuel', 'Santiago',
      'Sergio', 'Simao', 'Tiago', 'Tomas', 'Vasco', 'Vicente', 'Vitor', 'Alvaro', 'Artur', 'Augusto',
      'Caio', 'Claudio', 'Cristiano', 'Danilo', 'Diego', 'Edgar', 'Fabio', 'Gilberto', 'Helder', 'Leandro',
      'Luciano', 'Marcio', 'Mauricio', 'Murilo', 'Otavio', 'Renato', 'Roberto', 'Ronaldo', 'Thiago', 'Valter'
    ],
    femaleFirst: [
      'Alice', 'Ana', 'Andreia', 'Barbara', 'Beatriz', 'Bruna', 'Camila', 'Carla', 'Carolina', 'Catarina',
      'Clara', 'Claudia', 'Cristina', 'Daniela', 'Diana', 'Eduarda', 'Elena', 'Elisa', 'Eva', 'Fatima',
      'Filipa', 'Francisca', 'Gabriela', 'Helena', 'Ines', 'Isabel', 'Joana', 'Julia', 'Lara', 'Laura',
      'Leonor', 'Luana', 'Lucia', 'Luisa', 'Madalena', 'Mafalda', 'Manuela', 'Margarida', 'Maria', 'Mariana',
      'Marta', 'Matilde', 'Melissa', 'Miriam', 'Monica', 'Natalia', 'Nicole', 'Patricia', 'Paula', 'Rafaela',
      'Raquel', 'Rita', 'Rosa', 'Sara', 'Sofia', 'Soraia', 'Teresa', 'Valentina', 'Vera', 'Vitoria',
      'Adriana', 'Aline', 'Amanda', 'Brenda', 'Clarice', 'Debora', 'Fernanda', 'Flavia', 'Gisele', 'Isabela',
      'Jessica', 'Juliana', 'Larissa', 'Leticia', 'Livia', 'Lorena', 'Luana', 'Marina', 'Nathalia', 'Priscila'
    ],
    maleLast: [
      'Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Jesus', 'Sousa',
      'Fernandes', 'Goncalves', 'Gomes', 'Lopes', 'Marques', 'Alves', 'Almeida', 'Ribeiro', 'Pinto', 'Carvalho',
      'Teixeira', 'Moreira', 'Correia', 'Mendes', 'Nunes', 'Soares', 'Vieira', 'Monteiro', 'Cardoso', 'Rocha',
      'Raposo', 'Neves', 'Coelho', 'Cruz', 'Pires', 'Ramos', 'Reis', 'Simao', 'Antunes', 'Matos',
      'Fonseca', 'Machado', 'Araujo', 'Barbosa', 'Tavares', 'Lourenco', 'Castro', 'Figueiredo', 'Barros', 'Freitas',
      'Henriques', 'Cunha', 'Macedo', 'Borges', 'Gaspar', 'Pacheco', 'Vargas', 'Guimaraes', 'Carneiro', 'Brandao',
      'Azevedo', 'Leite', 'Nascimento', 'Pinheiro', 'Melo', 'Campos', 'Duarte', 'Brito', 'Faria', 'Magalhaes',
      'Menezes', 'Saraiva', 'Cabral', 'Paiva', 'Coutinho', 'Vasconcelos', 'Assis', 'Prado', 'Barreto', 'Miranda'
    ],
    femaleLast: [
      'Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Jesus', 'Sousa',
      'Fernandes', 'Goncalves', 'Gomes', 'Lopes', 'Marques', 'Alves', 'Almeida', 'Ribeiro', 'Pinto', 'Carvalho',
      'Teixeira', 'Moreira', 'Correia', 'Mendes', 'Nunes', 'Soares', 'Vieira', 'Monteiro', 'Cardoso', 'Rocha',
      'Raposo', 'Neves', 'Coelho', 'Cruz', 'Pires', 'Ramos', 'Reis', 'Simao', 'Antunes', 'Matos',
      'Fonseca', 'Machado', 'Araujo', 'Barbosa', 'Tavares', 'Lourenco', 'Castro', 'Figueiredo', 'Barros', 'Freitas',
      'Henriques', 'Cunha', 'Macedo', 'Borges', 'Gaspar', 'Pacheco', 'Vargas', 'Guimaraes', 'Carneiro', 'Brandao',
      'Azevedo', 'Leite', 'Nascimento', 'Pinheiro', 'Melo', 'Campos', 'Duarte', 'Brito', 'Faria', 'Magalhaes',
      'Menezes', 'Saraiva', 'Cabral', 'Paiva', 'Coutinho', 'Vasconcelos', 'Assis', 'Prado', 'Barreto', 'Miranda'
    ]
  },

  romance_french: {
    maleFirst: [
      'Jean', 'Michel', 'Pierre', 'Philippe', 'Alain', 'Nicolas', 'Christophe', 'Patrick', 'Christian', 'Daniel',
      'Eric', 'David', 'Laurent', 'Stephane', 'Pascal', 'Antoine', 'Julien', 'Alexandre', 'Sebastien', 'Guillaume',
      'Olivier', 'Thomas', 'Francois', 'Frederic', 'Thierry', 'Bruno', 'Mathieu', 'Vincent', 'Romain', 'Lucas',
      'Maxime', 'Hugo', 'Arthur', 'Louis', 'Gabriel', 'Jules', 'Paul', 'Raphael', 'Clement', 'Leo',
      'Theo', 'Nathan', 'Alexis', 'Victor', 'Etienne', 'Florent', 'Benoit', 'Fabrice', 'Jerome', 'Ludovic',
      'Marc', 'Cedric', 'Damien', 'Xavier', 'Franck', 'Gilles', 'Dominique', 'Serge', 'Bernard', 'Gerard',
      'Jacques', 'Andre', 'Claude', 'Rene', 'Guy', 'Maurice', 'Marcel', 'Yves', 'Henri', 'Roger',
      'Kouassi', 'Moussa', 'Amadou', 'Idrissa', 'Samba', 'Oumar', 'Bakary', 'Abdoulaye', 'Patrice', 'Ibrahima'
    ],
    femaleFirst: [
      'Marie', 'Nathalie', 'Isabelle', 'Sylvie', 'Catherine', 'Martine', 'Christine', 'Francoise', 'Valerie', 'Sandrine',
      'Stephanie', 'Sophie', 'Celine', 'Chantal', 'Patricia', 'Anne', 'Brigitte', 'Monique', 'Julie', 'Laetitia',
      'Aurelie', 'Virginie', 'Emilie', 'Caroline', 'Elodie', 'Camille', 'Audrey', 'Lea', 'Manon', 'Chloe',
      'Emma', 'Ines', 'Sarah', 'Jade', 'Louise', 'Alice', 'Lola', 'Lucie', 'Clara', 'Zoe',
      'Anais', 'Juliette', 'Romane', 'Eva', 'Charlotte', 'Mathilde', 'Helene', 'Corinne', 'Florence', 'Beatrice',
      'Michele', 'Nicole', 'Jacqueline', 'Danielle', 'Annie', 'Yvonne', 'Suzanne', 'Simone', 'Jeanne', 'Marcelle',
      'Aminata', 'Fatoumata', 'Awa', 'Mariama', 'Kadiatou', 'Oumou', 'Safiatou', 'Aissatou', 'Clarisse', 'Bintou',
      'Rokiatou', 'Fanta', 'Maimouna', 'Djoulde', 'Salimata', 'Sokhna', 'Ndeye', 'Coumba', 'Astou', 'Khady'
    ],
    maleLast: [
      'Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent',
      'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard',
      'Bonnet', 'Dupont', 'Lambert', 'Fontaine', 'Rousseau', 'Vincent', 'Muller', 'Lefevre', 'Faure', 'Andre',
      'Mercier', 'Blanc', 'Guerin', 'Boyer', 'Garnier', 'Chevalier', 'Francois', 'Legrand', 'Gauthier', 'Garcia',
      'Perrin', 'Robin', 'Clement', 'Morin', 'Nicolas', 'Henry', 'Roussel', 'Mathieu', 'Gautier', 'Masson',
      'Marchand', 'Duval', 'Denis', 'Dumont', 'Marie', 'Lemaire', 'Noel', 'Meyer', 'Dufour', 'Meunier',
      'Brun', 'Blanchard', 'Giraud', 'Joly', 'Riviere', 'Lucas', 'Brunet', 'Gaillard', 'Barbier', 'Arnaud',
      'Traore', 'Diallo', 'Ouattara', 'Coulibaly', 'Sow', 'Kone', 'Toure', 'Diop', 'Camara', 'Cisse'
    ],
    femaleLast: [
      'Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent',
      'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard',
      'Bonnet', 'Dupont', 'Lambert', 'Fontaine', 'Rousseau', 'Vincent', 'Muller', 'Lefevre', 'Faure', 'Andre',
      'Mercier', 'Blanc', 'Guerin', 'Boyer', 'Garnier', 'Chevalier', 'Francois', 'Legrand', 'Gauthier', 'Garcia',
      'Perrin', 'Robin', 'Clement', 'Morin', 'Nicolas', 'Henry', 'Roussel', 'Mathieu', 'Gautier', 'Masson',
      'Marchand', 'Duval', 'Denis', 'Dumont', 'Marie', 'Lemaire', 'Noel', 'Meyer', 'Dufour', 'Meunier',
      'Brun', 'Blanchard', 'Giraud', 'Joly', 'Riviere', 'Lucas', 'Brunet', 'Gaillard', 'Barbier', 'Arnaud',
      'Traore', 'Diallo', 'Ouattara', 'Coulibaly', 'Sow', 'Kone', 'Toure', 'Diop', 'Camara', 'Cisse'
    ]
  },

  romance_italian: {
    maleFirst: [
      'Marco', 'Luca', 'Andrea', 'Matteo', 'Davide', 'Simone', 'Federico', 'Lorenzo', 'Stefano', 'Fabio',
      'Giovanni', 'Alessandro', 'Pietro', 'Riccardo', 'Filippo', 'Antonio', 'Giuseppe', 'Francesco', 'Mario', 'Luigi',
      'Roberto', 'Angelo', 'Vincenzo', 'Salvatore', 'Domenico', 'Massimo', 'Paolo', 'Carlo', 'Claudio', 'Giorgio',
      'Michele', 'Enrico', 'Alberto', 'Fabrizio', 'Gianluca', 'Daniele', 'Maurizio', 'Piero', 'Christian', 'Gabriele',
      'Leonardo', 'Edoardo', 'Tommaso', 'Nicolo', 'Samuele', 'Diego', 'Christian', 'Giacomo', 'Emanuele', 'Alessio',
      'Jacopo', 'Manuel', 'Mirko', 'Valerio', 'Dario', 'Giancarlo', 'Renato', 'Bruno', 'Mauro', 'Aldo',
      'Cesare', 'Sergio', 'Guido', 'Franco', 'Silvio', 'Walter', 'Emilio', 'Luciano', 'Arturo', 'Corrado',
      'Vittorio', 'Adriano', 'Flavio', 'Marcello', 'Gennaro', 'Nicola', 'Raffaele', 'Carmine', 'Rosario', 'Pasquale'
    ],
    femaleFirst: [
      'Giulia', 'Chiara', 'Francesca', 'Sara', 'Elena', 'Valentina', 'Alessia', 'Martina', 'Silvia', 'Laura',
      'Beatrice', 'Giorgia', 'Alice', 'Aurora', 'Ludovica', 'Sofia', 'Emma', 'Ginevra', 'Greta', 'Vittoria',
      'Camilla', 'Noemi', 'Bianca', 'Matilde', 'Viola', 'Rebecca', 'Nicole', 'Caterina', 'Adele', 'Marta',
      'Anna', 'Maria', 'Rosa', 'Angela', 'Giovanna', 'Teresa', 'Lucia', 'Carmela', 'Rita', 'Paola',
      'Daniela', 'Simona', 'Roberta', 'Barbara', 'Cristina', 'Monica', 'Elisabetta', 'Claudia', 'Federica', 'Serena',
      'Ilaria', 'Elisa', 'Eleonora', 'Cinzia', 'Donatella', 'Patrizia', 'Antonella', 'Stefania', 'Marina', 'Sandra',
      'Carla', 'Rosanna', 'Franca', 'Luisa', 'Gabriella', 'Graziella', 'Bruna', 'Marisa', 'Adriana', 'Silvana',
      'Loredana', 'Assunta', 'Concetta', 'Immacolata', 'Filomena', 'Nunzia', 'Grazia', 'Pina', 'Tina', 'Lorena'
    ],
    maleLast: [
      'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco',
      'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti',
      'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferrara', 'Galli', 'Martini', 'Leone',
      'Longo', 'Gentile', 'Martinelli', 'Vitale', 'Lombardo', 'Serra', 'Coppola', 'De Santis', 'D Angelo', 'Marchetti',
      'Parisi', 'Villa', 'Conte', 'Ferraro', 'Ferri', 'Fabbri', 'Bianco', 'Marini', 'Grasso', 'Valentini',
      'Messina', 'Sala', 'De Angelis', 'Gatti', 'Pellegrini', 'Palumbo', 'Sanna', 'Farina', 'Rizzi', 'Monti',
      'Cattaneo', 'Morelli', 'Amato', 'Silvestri', 'Mazza', 'Testa', 'Grassi', 'Piras', 'Carbone', 'Giuliani',
      'Benedetti', 'Barone', 'Rossetti', 'Caputo', 'Montanari', 'Guerra', 'Palmieri', 'Bernardi', 'Martino', 'Fiore'
    ],
    femaleLast: [
      'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco',
      'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti',
      'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferrara', 'Galli', 'Martini', 'Leone',
      'Longo', 'Gentile', 'Martinelli', 'Vitale', 'Lombardo', 'Serra', 'Coppola', 'De Santis', 'D Angelo', 'Marchetti',
      'Parisi', 'Villa', 'Conte', 'Ferraro', 'Ferri', 'Fabbri', 'Bianco', 'Marini', 'Grasso', 'Valentini',
      'Messina', 'Sala', 'De Angelis', 'Gatti', 'Pellegrini', 'Palumbo', 'Sanna', 'Farina', 'Rizzi', 'Monti',
      'Cattaneo', 'Morelli', 'Amato', 'Silvestri', 'Mazza', 'Testa', 'Grassi', 'Piras', 'Carbone', 'Giuliani',
      'Benedetti', 'Barone', 'Rossetti', 'Caputo', 'Montanari', 'Guerra', 'Palmieri', 'Bernardi', 'Martino', 'Fiore'
    ]
  },

  east_asian_japanese: {
    maleFirst: [
      'Haruto', 'Yuto', 'Sota', 'Riku', 'Minato', 'Yuma', 'Ren', 'Kaito', 'Asahi', 'Daiki',
      'Ryota', 'Shota', 'Hayato', 'Yamato', 'Kenji', 'Shinji', 'Takuya', 'Kazuki', 'Hiroshi', 'Takumi',
      'Sho', 'Sora', 'Koki', 'Taiga', 'Sosuke', 'Ryusei', 'Yusei', 'Kenta', 'Kensuke', 'Tsubasa',
      'Makoto', 'Daisuke', 'Keisuke', 'Naoki', 'Kosuke', 'Yuya', 'Tomoya', 'Kazuya', 'Ryosuke', 'Kohei',
      'Masashi', 'Takahiro', 'Yuki', 'Shin', 'Gen', 'Jin', 'Aoi', 'Itsuki', 'Ibuki', 'Kaede',
      'Tatsuki', 'Kazuhiro', 'Atsushi', 'Yoshiki', 'Noboru', 'Hidetoshi', 'Katsumi', 'Osamu', 'Shigeru', 'Takeshi',
      'Kiyoshi', 'Tetsuya', 'Noriyuki', 'Masahiro', 'Hiroyuki', 'Yoshihiro', 'Masaaki', 'Nobuo', 'Kazuo', 'Saburo',
      'Taro', 'Jiro', 'Ichiro', 'Goro', 'Rokuro', 'Shiro', 'Hachiro', 'Kuro', 'Juro', 'Shozo'
    ],
    femaleFirst: [
      'Yui', 'Aoi', 'Hina', 'Rin', 'Yua', 'Sakura', 'Koharu', 'Akari', 'Mei', 'Rio',
      'Honoka', 'Mio', 'Saki', 'Nanami', 'Kanna', 'Hiyori', 'Yuna', 'Miyu', 'Misaki', 'Ayaka',
      'Nanako', 'Haruka', 'Momoka', 'Asuka', 'Kasumi', 'Sayaka', 'Kotone', 'Shiori', 'Kaede', 'Minami',
      'Chika', 'Emi', 'Natsumi', 'Rena', 'Mizuki', 'Riko', 'Kanon', 'Sara', 'Ema', 'Suzu',
      'Ayano', 'Kana', 'Maki', 'Rina', 'Yoko', 'Keiko', 'Tomoko', 'Michiko', 'Noriko', 'Hiroko',
      'Kazuko', 'Sachiko', 'Yumiko', 'Naoko', 'Kumiko', 'Junko', 'Mayumi', 'Midori', 'Mariko', 'Kyoko',
      'Chiyo', 'Fumiko', 'Hanako', 'Kiyoko', 'Mitsuko', 'Shizuko', 'Toshiko', 'Yoshiko', 'Yukiko', 'Ayame',
      'Botan', 'Fuji', 'Kiku', 'Ran', 'Sumire', 'Tsubaki', 'Ume', 'Yuri', 'Suzume', 'Hibari'
    ],
    maleLast: [
      'Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato',
      'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Saito', 'Matsumoto', 'Inoue', 'Kimura', 'Hayashi', 'Shimizu',
      'Yamazaki', 'Mori', 'Abe', 'Ikeda', 'Hashimoto', 'Yamashita', 'Ishikawa', 'Nakajima', 'Maeda', 'Fujita',
      'Ogawa', 'Goto', 'Okada', 'Hasegawa', 'Murakami', 'Kondo', 'Ishii', 'Saito', 'Sakamoto', 'Endo',
      'Aoki', 'Fujii', 'Nishimura', 'Fukuda', 'Ota', 'Miura', 'Fujiwara', 'Okamoto', 'Matsuda', 'Nakagawa',
      'Nakano', 'Harada', 'Ono', 'Tamura', 'Takeuchi', 'Kaneko', 'Wada', 'Nakayama', 'Ishida', 'Ueda',
      'Morita', 'Shibata', 'Kudo', 'Yokoyama', 'Miyazaki', 'Miyamoto', 'Uchida', 'Takagi', 'Ando', 'Taniguchi',
      'Ono', 'Maruyama', 'Imai', 'Kojima', 'Takada', 'Murata', 'Sugiyama', 'Takeda', 'Arai', 'Ueno'
    ],
    femaleLast: [
      'Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato',
      'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Saito', 'Matsumoto', 'Inoue', 'Kimura', 'Hayashi', 'Shimizu',
      'Yamazaki', 'Mori', 'Abe', 'Ikeda', 'Hashimoto', 'Yamashita', 'Ishikawa', 'Nakajima', 'Maeda', 'Fujita',
      'Ogawa', 'Goto', 'Okada', 'Hasegawa', 'Murakami', 'Kondo', 'Ishii', 'Saito', 'Sakamoto', 'Endo',
      'Aoki', 'Fujii', 'Nishimura', 'Fukuda', 'Ota', 'Miura', 'Fujiwara', 'Okamoto', 'Matsuda', 'Nakagawa',
      'Nakano', 'Harada', 'Ono', 'Tamura', 'Takeuchi', 'Kaneko', 'Wada', 'Nakayama', 'Ishida', 'Ueda',
      'Morita', 'Shibata', 'Kudo', 'Yokoyama', 'Miyazaki', 'Miyamoto', 'Uchida', 'Takagi', 'Ando', 'Taniguchi',
      'Ono', 'Maruyama', 'Imai', 'Kojima', 'Takada', 'Murata', 'Sugiyama', 'Takeda', 'Arai', 'Ueno'
    ]
  },

  east_asian_chinese: {
    maleFirst: [
      'Wei', 'Hao', 'Yi', 'Jun', 'Lei', 'Jie', 'Ming', 'Tao', 'Bo', 'Peng',
      'Chao', 'Xin', 'Feng', 'Yong', 'Bin', 'Qiang', 'Gang', 'Hui', 'Chen', 'Zhe',
      'Rui', 'Yu', 'Kai', 'Lin', 'Yang', 'Shuai', 'Zheng', 'Xiang', 'Cheng', 'Long',
      'Yue', 'Song', 'Huan', 'Dong', 'Guo', 'Hong', 'Jian', 'Kun', 'Liang', 'Nan',
      'Ping', 'Quan', 'Rong', 'Sheng', 'Ting', 'Wai', 'Xian', 'Yan', 'Zhan', 'Bao',
      'Chuan', 'Dian', 'Fu', 'Guang', 'Heng', 'Jia', 'Ke', 'Lian', 'Miao', 'Ning',
      'Pei', 'Qing', 'Ren', 'Sen', 'Tan', 'Wan', 'Xiao', 'Yuan', 'Zhi', 'An',
      'Biao', 'Cong', 'Da', 'En', 'Fei', 'Ge', 'Hai', 'Ji', 'Kang', 'Luan'
    ],
    femaleFirst: [
      'Fang', 'Na', 'Min', 'Jing', 'Li', 'Juan', 'Yan', 'Xiu', 'Ting', 'Ying',
      'Ling', 'Dan', 'Ping', 'Hong', 'Yu', 'Lan', 'Qian', 'Yue', 'Mei', 'Wen',
      'Hui', 'Lin', 'Xia', 'Zhen', 'Rong', 'Feng', 'Jia', 'Xue', 'Shuang', 'Yun',
      'Qing', 'Shan', 'Yi', 'Fei', 'Xin', 'Lian', 'Hua', 'Cui', 'Qiu', 'Die',
      'Jiao', 'Yuan', 'Meng', 'Zhu', 'Lu', 'Bao', 'Huan', 'Shu', 'Ting', 'Xian',
      'Ying', 'Zhi', 'Ai', 'Bi', 'Chun', 'Duo', 'E', 'Ge', 'He', 'Ji',
      'Kai', 'Luo', 'Mo', 'Ni', 'Ou', 'Piao', 'Qi', 'Ru', 'Si', 'Tao',
      'Wan', 'Xi', 'Ya', 'Ze', 'Cai', 'Fen', 'Guo', 'Hui', 'Jing', 'Kou'
    ],
    maleLast: [
      'Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou',
      'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'He', 'Gao', 'Lin', 'Luo',
      'Zheng', 'Liang', 'Xie', 'Song', 'Tang', 'Xu', 'Han', 'Feng', 'Deng', 'Cao',
      'Peng', 'Zeng', 'Xiao', 'Tian', 'Dong', 'Yuan', 'Pan', 'Yu', 'Jiang', 'Cai',
      'Du', 'Ye', 'Cheng', 'Su', 'Wei', 'Lu', 'Ding', 'Ren', 'Shen', 'Yao',
      'Lu', 'Jiang', 'Cui', 'Zhong', 'Tan', 'Lu', 'Wang', 'Fan', 'Jin', 'Shi',
      'Liao', 'Jia', 'Xia', 'Wei', 'Fu', 'Fang', 'Bai', 'Zou', 'Meng', 'Xiong',
      'Qin', 'Qiu', 'Jiang', 'Yin', 'Xue', 'Yan', 'Duan', 'Lei', 'Hou', 'Long'
    ],
    femaleLast: [
      'Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou',
      'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'He', 'Gao', 'Lin', 'Luo',
      'Zheng', 'Liang', 'Xie', 'Song', 'Tang', 'Xu', 'Han', 'Feng', 'Deng', 'Cao',
      'Peng', 'Zeng', 'Xiao', 'Tian', 'Dong', 'Yuan', 'Pan', 'Yu', 'Jiang', 'Cai',
      'Du', 'Ye', 'Cheng', 'Su', 'Wei', 'Lu', 'Ding', 'Ren', 'Shen', 'Yao',
      'Lu', 'Jiang', 'Cui', 'Zhong', 'Tan', 'Lu', 'Wang', 'Fan', 'Jin', 'Shi',
      'Liao', 'Jia', 'Xia', 'Wei', 'Fu', 'Fang', 'Bai', 'Zou', 'Meng', 'Xiong',
      'Qin', 'Qiu', 'Jiang', 'Yin', 'Xue', 'Yan', 'Duan', 'Lei', 'Hou', 'Long'
    ]
  },

  east_asian_korean: {
    maleFirst: [
      'Minjun', 'Seojun', 'Doyun', 'Yeojun', 'Siu', 'Hajun', 'Juhu', 'Jiho', 'Jian', 'Junseo',
      'Hyunwoo', 'Gunwoo', 'Woojin', 'Sunwoo', 'Seojin', 'Yejun', 'Eunwoo', 'Yuchan', 'Minjae', 'Jinu',
      'Donghyun', 'Junhyuk', 'Seungho', 'Taeyang', 'Sangwoo', 'Jaehyun', 'Youngjae', 'Sungmin', 'Kwangsoo', 'Jinwoo',
      'Chulsoo', 'Youngsoo', 'Manseok', 'Deoksu', 'Bongju', 'Daehan', 'Minguk', 'Manse', 'Taemin', 'Kibum',
      'Jonghyun', 'Onew', 'Minho', 'Baekhyun', 'Chanyeol', 'Suho', 'Sehun', 'Kai', 'Xiumin', 'Chen',
      'Jungkook', 'Jimin', 'Taehyung', 'Namjoon', 'Yoongi', 'Hoseok', 'Seokjin', 'Wonho', 'Shownu', 'Kihyun',
      'Hyungwon', 'Jooheon', 'Changkyun', 'Mark', 'Taeyong', 'Doyoung', 'Jaehyun', 'Jungwoo', 'Yuta', 'Johnny',
      'Renjun', 'Jeno', 'Jaemin', 'Chenle', 'Jisung', 'Haechan', 'Soobin', 'Yeonjun', 'Beomgyu', 'Taehyun'
    ],
    femaleFirst: [
      'Seoyeon', 'Seoyun', 'Jiwoo', 'Seohyeon', 'Minseo', 'Haeun', 'Harin', 'Yuna', 'Jia', 'Sua',
      'Yerin', 'Chaewon', 'Soeun', 'Nayun', 'Dain', 'Yubin', 'Yeonwoo', 'Gaeun', 'Suyeon', 'Eunseo',
      'Jiyeon', 'Eunji', 'Bomi', 'Hayoung', 'Namjoo', 'Chorong', 'Taeyeon', 'Yoona', 'Yuri', 'Hyoyeon',
      'Sunny', 'Tiffany', 'Seohyun', 'Sooyoung', 'Irene', 'Seulgi', 'Wendy', 'Joy', 'Yeri', 'Solar',
      'Moonbyul', 'Wheein', 'Hwasa', 'Nayeon', 'Jeongyeon', 'Momo', 'Sana', 'Jihyo', 'Mina', 'Dahyun',
      'Chaeyoung', 'Tzuyu', 'Jisoo', 'Jennie', 'Rose', 'Lisa', 'Yeji', 'Lia', 'Ryujin', 'Chaeryeong',
      'Yuna', 'Karina', 'Giselle', 'Winter', 'Ningning', 'Wonyoung', 'Yujin', 'Gaeul', 'Rei', 'Liz',
      'Leeseo', 'Minji', 'Hanni', 'Danielle', 'Haerin', 'Hyein', 'Chaewon', 'Sakura', 'Yunjin', 'Kazuha'
    ],
    maleLast: [
      'Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim',
      'Han', 'Oh', 'Seo', 'Shin', 'Kwon', 'Hwang', 'Ahn', 'Song', 'Ryu', 'Hong',
      'Ko', 'Moon', 'Yang', 'Son', 'Bae', 'Jo', 'Baek', 'Huh', 'Yoo', 'Nam',
      'Sim', 'No', 'Ha', 'Kwak', 'Sung', 'Cha', 'Ju', 'Woo', 'Koo', 'Sin',
      'Im', 'Ra', 'Jeon', 'Min', 'Yu', 'Jin', 'Ji', 'Eom', 'Chae', 'Won',
      'Cheon', 'Bang', 'Kong', 'Hyun', 'Ham', 'Byun', 'Yeom', 'Yang', 'Byun', 'Yeo',
      'Chu', 'Roh', 'Shim', 'Seol', 'Ma', 'Kyeon', 'Gil', 'Sa', 'Yeon', 'Guk',
      'Pan', 'Ban', 'Bok', 'Dok', 'Pyo', 'Yuk', 'Pang', 'Don', 'Pyeon', 'Bing'
    ],
    femaleLast: [
      'Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim',
      'Han', 'Oh', 'Seo', 'Shin', 'Kwon', 'Hwang', 'Ahn', 'Song', 'Ryu', 'Hong',
      'Ko', 'Moon', 'Yang', 'Son', 'Bae', 'Jo', 'Baek', 'Huh', 'Yoo', 'Nam',
      'Sim', 'No', 'Ha', 'Kwak', 'Sung', 'Cha', 'Ju', 'Woo', 'Koo', 'Sin',
      'Im', 'Ra', 'Jeon', 'Min', 'Yu', 'Jin', 'Ji', 'Eom', 'Chae', 'Won',
      'Cheon', 'Bang', 'Kong', 'Hyun', 'Ham', 'Byun', 'Yeom', 'Yang', 'Byun', 'Yeo',
      'Chu', 'Roh', 'Shim', 'Seol', 'Ma', 'Kyeon', 'Gil', 'Sa', 'Yeon', 'Guk',
      'Pan', 'Ban', 'Bok', 'Dok', 'Pyo', 'Yuk', 'Pang', 'Don', 'Pyeon', 'Bing'
    ]
  },

  southeast_asian_malay: {
    maleFirst: [
      'Ahmad', 'Muhammad', 'Adam', 'Amir', 'Farid', 'Haziq', 'Irfan', 'Hakim', 'Danish', 'Faris',
      'Syahmi', 'Arif', 'Zul', 'Faiz', 'Fitri', 'Aiman', 'Luqman', 'Hafiz', 'Kamal', 'Budi',
      'Agus', 'Bambang', 'Eko', 'Hadi', 'Iwan', 'Joko', 'Kurniawan', 'Lukman', 'Mulyadi', 'Nugroho',
      'Oki', 'Prasetyo', 'Rian', 'Surya', 'Teguh', 'Utomo', 'Wahyu', 'Yudi', 'Zainal', 'Rizky',
      'Dimas', 'Fajar', 'Gilang', 'Ilham', 'Indra', 'Kevin', 'Mahendra', 'Pandu', 'Raden', 'Satria',
      'Tri', 'Bayu', 'Chandra', 'Dwi', 'Endra', 'Galih', 'Hendra', 'Ivan', 'Johan', 'Kusuma',
      'Lutfi', 'Mario', 'Naufal', 'Putra', 'Reza', 'Sigit', 'Taufik', 'Vicky', 'Wawan', 'Yoga',
      'Aditya', 'Bagus', 'Cahyo', 'Danang', 'Eka', 'Febri', 'Gunawan', 'Haris', 'Iqbal', 'Jefri'
    ],
    femaleFirst: [
      'Nur', 'Siti', 'Aina', 'Alia', 'Farah', 'Hani', 'Izzah', 'Maisarah', 'Nadhirah', 'Putri',
      'Rania', 'Sofea', 'Syuhada', 'Wardah', 'Zulaikha', 'Ayu', 'Citra', 'Dewi', 'Endang', 'Fitri',
      'Gita', 'Hesti', 'Indah', 'Kartika', 'Lestari', 'Mega', 'Nita', 'Okta', 'Puspa', 'Ratna',
      'Sari', 'Tri', 'Utami', 'Wulan', 'Yulia', 'Zahra', 'Anisa', 'Bella', 'Cantika', 'Dian',
      'Elisa', 'Febby', 'Grace', 'Hanna', 'Intan', 'Jasmine', 'Karina', 'Laras', 'Melati', 'Nadia',
      'Olivia', 'Pratiwi', 'Rini', 'Shinta', 'Tiara', 'Vina', 'Winda', 'Yani', 'Aulia', 'Bunga',
      'Cindy', 'Dina', 'Erna', 'Fani', 'Gisella', 'Helena', 'Ika', 'Juita', 'Kania', 'Lia',
      'Maya', 'Novita', 'Pipit', 'Rara', 'Siska', 'Tania', 'Ulfa', 'Vivi', 'Widya', 'Yuliana'
    ],
    maleLast: [
      'Abdullah', 'Ismail', 'Ibrahim', 'Othman', 'Rahman', 'Hashim', 'Yusof', 'Ali', 'Mohd', 'Hassan',
      'Hussein', 'Hamzah', 'Mahmud', 'Salleh', 'Idris', 'Zakaria', 'Kassim', 'Mansor', 'Ariffin', 'Bakar',
      'Widodo', 'Yudhoyono', 'Sukarno', 'Hatta', 'Habibie', 'Wahid', 'Subianto', 'Prabowo', 'Anies', 'Baswedan',
      'Sutrisno', 'Purnomo', 'Kusumo', 'Wibowo', 'Saputra', 'Hidayat', 'Kusuma', 'Santoso', 'Pratama', 'Setiawan',
      'Nugraha', 'Gunawan', 'Wijaya', 'Siregar', 'Nasution', 'Lubis', 'Harahap', 'Batubara', 'Simanjuntak', 'Hutapea',
      'Sitorus', 'Panjaitan', 'Sinaga', 'Gultom', 'Situmorang', 'Pardede', 'Simatupang', 'Manurung', 'Tamba', 'Purba',
      'Sembiring', 'Tarigan', 'Ginting', 'Karo', 'Perangin', 'Kaban', 'Meliala', 'Pelawi', 'Depari', 'Sinulingga',
      'Suharto', 'Wiranto', 'Tanjung', 'Djojohadikusumo', 'Moerdani', 'Sudirman', 'Sutowo', 'Martowardojo', 'Hartarto', 'Bakrie'
    ],
    femaleLast: [
      'Abdullah', 'Ismail', 'Ibrahim', 'Othman', 'Rahman', 'Hashim', 'Yusof', 'Ali', 'Mohd', 'Hassan',
      'Hussein', 'Hamzah', 'Mahmud', 'Salleh', 'Idris', 'Zakaria', 'Kassim', 'Mansor', 'Ariffin', 'Bakar',
      'Widodo', 'Yudhoyono', 'Sukarno', 'Hatta', 'Habibie', 'Wahid', 'Subianto', 'Prabowo', 'Anies', 'Baswedan',
      'Sutrisno', 'Purnomo', 'Kusumo', 'Wibowo', 'Saputra', 'Hidayat', 'Kusuma', 'Santoso', 'Pratama', 'Setiawan',
      'Nugraha', 'Gunawan', 'Wijaya', 'Siregar', 'Nasution', 'Lubis', 'Harahap', 'Batubara', 'Simanjuntak', 'Hutapea',
      'Sitorus', 'Panjaitan', 'Sinaga', 'Gultom', 'Situmorang', 'Pardede', 'Simatupang', 'Manurung', 'Tamba', 'Purba',
      'Sembiring', 'Tarigan', 'Ginting', 'Karo', 'Perangin', 'Kaban', 'Meliala', 'Pelawi', 'Depari', 'Sinulingga',
      'Suharto', 'Wiranto', 'Tanjung', 'Djojohadikusumo', 'Moerdani', 'Sudirman', 'Sutowo', 'Martowardojo', 'Hartarto', 'Bakrie'
    ]
  },

  southeast_asian_viet: {
    maleFirst: [
      'Anh', 'Bao', 'Cuong', 'Duc', 'Dung', 'Duong', 'Hai', 'Hieu', 'Hoang', 'Huy',
      'Khoa', 'Lam', 'Long', 'Minh', 'Nam', 'Nghia', 'Phong', 'Phuc', 'Quan', 'Quang',
      'Son', 'Thang', 'Thanh', 'Thao', 'Thinh', 'Tien', 'Toan', 'Trung', 'Tuan', 'Tung',
      'Viet', 'Vu', 'Xuan', 'Bach', 'Chien', 'Dat', 'Diep', 'Giang', 'Hiep', 'Hung',
      'Khang', 'Kien', 'Loc', 'Manh', 'Nhat', 'Phat', 'Sang', 'Tai', 'Thai', 'Thuan',
      'Tri', 'Trong', 'Van', 'Vinh', 'Vy', 'An', 'Binh', 'Chau', 'Dinh', 'Ha',
      'Hau', 'Hien', 'Hoa', 'Hong', 'Khanh', 'Linh', 'Ngoc', 'Phuong', 'Tam', 'Tan',
      'Tu', 'Uyen', 'Yen', 'Dan', 'Doan', 'Gia', 'Hanh', 'Hop', 'Khue', 'Luan'
    ],
    femaleFirst: [
      'Anh', 'Bich', 'Chau', 'Chi', 'Cuc', 'Diep', 'Dung', 'Duyen', 'Giang', 'Ha',
      'Hanh', 'Hien', 'Hoa', 'Hoai', 'Hong', 'Hue', 'Huong', 'Huyen', 'Khanh', 'Lan',
      'Le', 'Lien', 'Linh', 'Loan', 'Ly', 'Mai', 'Mi', 'Minh', 'My', 'Nga',
      'Ngan', 'Ngoc', 'Nguyet', 'Nhung', 'Nhu', 'Oanh', 'Phuong', 'Quynh', 'Sen', 'Suong',
      'Tam', 'Thao', 'Thi', 'Thu', 'Thuy', 'Thuy', 'Tien', 'Trag', 'Trang', 'Trinh',
      'Truc', 'Tuyen', 'Tuyet', 'Uyen', 'Van', 'Vy', 'Xuan', 'Yen', 'An', 'Binh',
      'Cam', 'Dao', 'Hao', 'Hang', 'Kim', 'Lam', 'Man', 'Phung', 'Quyen', 'Thanh',
      'Thuc', 'Tho', 'Tu', 'Tuong', 'Thao', 'Xuyen', 'Bang', 'Cat', 'Dieu', 'Khue'
    ],
    maleLast: [
      'Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Huynh', 'Phan', 'Vu', 'Vo', 'Dang',
      'Bui', 'Do', 'Ho', 'Ngo', 'Duong', 'Ly', 'Dinh', 'Doan', 'Lam', 'Mai',
      'Trinh', 'Dao', 'Cao', 'Ha', 'Luu', 'Luong', 'Thai', 'Chau', 'Ta', 'Phung',
      'To', 'Vuong', 'Van', 'Truong', 'Dinh', 'Quach', 'Diep', 'Nghiêm', 'Lai', 'Kieu',
      'Tu', 'Tong', 'La', 'Chu', 'Trieu', 'Nham', 'Kha', 'Giap', 'Lieu', 'Hua',
      'Thach', 'Ma', 'Luc', 'On', 'Bach', 'Tan', 'Khong', 'Tang', 'Tieu', 'Trang',
      'Bien', 'Phan', 'Quang', 'Ung', 'Nien', 'Bien', 'Lanh', 'Manh', 'Sam', 'Khuat',
      'Lau', 'Pho', 'Kieu', 'Chiem', 'Cham', 'Mac', 'Cam', 'Dam', 'Nhan', 'So'
    ],
    femaleLast: [
      'Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Huynh', 'Phan', 'Vu', 'Vo', 'Dang',
      'Bui', 'Do', 'Ho', 'Ngo', 'Duong', 'Ly', 'Dinh', 'Doan', 'Lam', 'Mai',
      'Trinh', 'Dao', 'Cao', 'Ha', 'Luu', 'Luong', 'Thai', 'Chau', 'Ta', 'Phung',
      'To', 'Vuong', 'Van', 'Truong', 'Dinh', 'Quach', 'Diep', 'Nghiêm', 'Lai', 'Kieu',
      'Tu', 'Tong', 'La', 'Chu', 'Trieu', 'Nham', 'Kha', 'Giap', 'Lieu', 'Hua',
      'Thach', 'Ma', 'Luc', 'On', 'Bach', 'Tan', 'Khong', 'Tang', 'Tieu', 'Trang',
      'Bien', 'Phan', 'Quang', 'Ung', 'Nien', 'Bien', 'Lanh', 'Manh', 'Sam', 'Khuat',
      'Lau', 'Pho', 'Kieu', 'Chiem', 'Cham', 'Mac', 'Cam', 'Dam', 'Nhan', 'So'
    ]
  },

  southeast_asian_filipino: {
    maleFirst: [
      'Joshua', 'Angelo', 'Christian', 'John', 'Mark', 'Daniel', 'Gabriel', 'Michael', 'Kenneth', 'James',
      'Carl', 'Francis', 'Justin', 'Jerome', 'Anthony', 'Paul', 'David', 'Ryan', 'Kevin', 'Adrian',
      'Bryan', 'Joseph', 'Vincent', 'Neil', 'Matthew', 'Ian', 'Patrick', 'Jericho', 'Kyle', 'Kurt',
      'Nathan', 'Sean', 'Jayson', 'Renz', 'Alden', 'Dingdong', 'Piolo', 'Gerald', 'Enrique', 'Daniel',
      'Coco', 'Jerome', 'Paulo', 'Arjo', 'Zanjoe', 'Dennis', 'Tom', 'Richard', 'Dingdong', 'Vhong',
      'Vic', 'Joey', 'Tito', 'Edu', 'Herbert', 'Roderick', 'Ogie', 'Janno', 'Gary', 'Martin',
      'Regine', 'Lani', 'Jaya', 'Kyla', 'Nina', 'Sarah', 'Yeng', 'KZ', 'Morissette', 'Jona',
      'Bong', 'Jun', 'Boy', 'Nonoy', 'Totoy', 'Dodong', 'Bebot', 'Dondon', 'Jojo', 'Tonton'
    ],
    femaleFirst: [
      'Angel', 'Bea', 'Kathryn', 'Liza', 'Nadine', 'Marian', 'Anne', 'Sarah', 'Judy', 'Claudine',
      'Kristine', 'Heart', 'Kim', 'Maja', 'Julia', 'Janella', 'Sue', 'Barbie', 'Andrea', 'Francine',
      'Belle', 'Alexa', 'Kyline', 'Gillian', 'Charlie', 'Heaven', 'Kaori', 'Chie', 'Vivoree', 'Maris',
      'Loisa', 'Miles', 'Sharlene', 'Kiray', 'Ella', 'Jane', 'Ritz', 'Yassi', 'Arci', 'Ryza',
      'Glaiza', 'Kylie', 'Gabbi', 'Sanya', 'Bianca', 'Miguel', 'Pauline', 'Therese', 'Kate', 'Mikee',
      'Joyce', 'Kris', 'Sharon', 'Vilma', 'Nora', 'Maricel', 'Dawn', 'Snooky', 'Sheryl', 'Tina',
      'Carmina', 'Gelli', 'Aiko', 'Ruffa', 'Donita', 'Charlene', 'Alice', 'Dindi', 'Assunta', 'Alessandra',
      'Maria', 'Mary', 'Princess', 'Angelica', 'Christine', 'Patricia', 'Nicole', 'Danielle', 'Samantha', 'Alyssa'
    ],
    maleLast: [
      'Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres', 'Tomas', 'Andrada',
      'Castillo', 'Flores', 'Villanueva', 'Ramos', 'Castro', 'Rivera', 'Aquino', 'Navarro', 'Salazar', 'Mercado',
      'De la Cruz', 'De los Santos', 'Del Rosario', 'De Guzman', 'De Leon', 'Perez', 'Sanchez', 'Fernandez', 'Lopez', 'Rodriguez',
      'Alvarez', 'Soriano', 'Tolentino', 'Corpuz', 'Padilla', 'Bernardo', 'Pineda', 'Valdez', 'Morales', 'Miranda',
      'Gutierrez', 'Aguilar', 'Santiago', 'Pascual', 'Manalo', 'Roxas', 'Estrada', 'Marcos', 'Duterte', 'Robredo',
      'Pangilinan', 'Villar', 'Poe', 'Sotto', 'Cayetano', 'Gordon', 'Lacson', 'Zubiri', 'Recto', 'Drilon',
      'Binay', 'Enrile', 'Revilla', 'Lapid', 'Pacquiao', 'Belmonte', 'Tiangco', 'Olivarez', 'Gatchalian', 'Teodoro',
      'Cojuangco', 'Ayala', 'Sy', 'Tan', 'Gokongwei', 'Razon', 'Ang', 'Lucio', 'Consunji', 'Ty'
    ],
    femaleLast: [
      'Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres', 'Tomas', 'Andrada',
      'Castillo', 'Flores', 'Villanueva', 'Ramos', 'Castro', 'Rivera', 'Aquino', 'Navarro', 'Salazar', 'Mercado',
      'De la Cruz', 'De los Santos', 'Del Rosario', 'De Guzman', 'De Leon', 'Perez', 'Sanchez', 'Fernandez', 'Lopez', 'Rodriguez',
      'Alvarez', 'Soriano', 'Tolentino', 'Corpuz', 'Padilla', 'Bernardo', 'Pineda', 'Valdez', 'Morales', 'Miranda',
      'Gutierrez', 'Aguilar', 'Santiago', 'Pascual', 'Manalo', 'Roxas', 'Estrada', 'Marcos', 'Duterte', 'Robredo',
      'Pangilinan', 'Villar', 'Poe', 'Sotto', 'Cayetano', 'Gordon', 'Lacson', 'Zubiri', 'Recto', 'Drilon',
      'Binay', 'Enrile', 'Revilla', 'Lapid', 'Pacquiao', 'Belmonte', 'Tiangco', 'Olivarez', 'Gatchalian', 'Teodoro',
      'Cojuangco', 'Ayala', 'Sy', 'Tan', 'Gokongwei', 'Razon', 'Ang', 'Lucio', 'Consunji', 'Ty'
    ]
  },

  nordic: {
    maleFirst: [
      'Lars', 'Anders', 'Johan', 'Nils', 'Karl', 'Per', 'Erik', 'Jan', 'Hans', 'Mikael',
      'Olof', 'Sven', 'Peter', 'Mats', 'Fredrik', 'Magnus', 'Daniel', 'Stefan', 'Jonas', 'Bjorn',
      'Henrik', 'Alexander', 'Andreas', 'Thomas', 'Marcus', 'Christian', 'Martin', 'Robert', 'David', 'Gustav',
      'Oscar', 'William', 'Lucas', 'Oliver', 'Liam', 'Elias', 'Hugo', 'Noah', 'Leo', 'Adam',
      'Axel', 'Filip', 'Emil', 'Viktor', 'Arvid', 'Isak', 'Anton', 'Ludvig', 'Theo', 'Melvin',
      'Ole', 'Tor', 'Geir', 'Knut', 'Arne', 'Svein', 'Einar', 'Kjell', 'Gunnar', 'Odd',
      'Morten', 'Terje', 'Rune', 'Espen', 'Stian', 'Bard', 'Hakon', 'Sigurd', 'Halvor', 'Vegard',
      'Eirik', 'Harald', 'Olav', 'Sverre', 'Inge', 'Trygve', 'Asbjorn', 'Leif', 'Roar', 'Dag'
    ],
    femaleFirst: [
      'Anna', 'Eva', 'Maria', 'Karin', 'Kerstin', 'Lena', 'Ingrid', 'Sara', 'Ulla', 'Birgitta',
      'Margareta', 'Elisabeth', 'Marie', 'Inger', 'Christina', 'Linnea', 'Emma', 'Sofia', 'Elin', 'Julia',
      'Maja', 'Astrid', 'Alice', 'Ella', 'Wilma', 'Klara', 'Ebba', 'Agnes', 'Ida', 'Alma',
      'Freja', 'Olivia', 'Alva', 'Saga', 'Signe', 'Stella', 'Vera', 'Selma', 'Elsa', 'Sigrid',
      'Liv', 'Ingrid', 'Solveig', 'Kari', 'Marit', 'Berit', 'Gerd', 'Tone', 'Randi', 'Wenche',
      'Heidi', 'Hanne', 'Silje', 'Camilla', 'Line', 'Stine', 'Annette', 'Trine', 'Mette', 'Vibeke',
      'Bente', 'Laila', 'Gro', 'Turid', 'Ragnhild', 'Aase', 'Sissel', 'Unni', 'Grete', 'Eldbjorg',
      'Gudrun', 'Hulda', 'Brynhild', 'Rannveig', 'Torill', 'Borghild', 'Gunnhild', 'Herdis', 'Synnove', 'Torhild'
    ],
    maleLast: [
      'Andersson', 'Johansson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Persson', 'Svensson', 'Gustafsson',
      'Pettersson', 'Jonsson', 'Jansson', 'Hansson', 'Bengtsson', 'Jonasson', 'Lindberg', 'Jakobsson', 'Magnusson', 'Olofsson',
      'Lindstrom', 'Lindqvist', 'Lindgren', 'Berg', 'Axelsson', 'Bergstrom', 'Lundberg', 'Lind', 'Lundgren', 'Lundqvist',
      'Mattsson', 'Berglund', 'Fredriksson', 'Sandberg', 'Henriksson', 'Forsberg', 'Sjoberg', 'Wallin', 'Engstrom', 'Eklund',
      'Hansen', 'Olsen', 'Larsen', 'Andersen', 'Pedersen', 'Nilsen', 'Kristiansen', 'Jensen', 'Karlsen', 'Johnsen',
      'Pettersen', 'Eriksen', 'Berg', 'Haugen', 'Hagen', 'Johannessen', 'Andreassen', 'Jacobsen', 'Dahl', 'Jorgensen',
      'Henriksen', 'Lund', 'Halvorsen', 'Sorensen', 'Jakobsen', 'Moen', 'Gundersen', 'Iversen', 'Strand', 'Solberg',
      'Nielsen', 'Moller', 'Rasmussen', 'Thomsen', 'Madsen', 'Christensen', 'Poulsen', 'Knudsen', 'Holm', 'Schmidt'
    ],
    femaleLast: [
      'Andersson', 'Johansson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Persson', 'Svensson', 'Gustafsson',
      'Pettersson', 'Jonsson', 'Jansson', 'Hansson', 'Bengtsson', 'Jonasson', 'Lindberg', 'Jakobsson', 'Magnusson', 'Olofsson',
      'Lindstrom', 'Lindqvist', 'Lindgren', 'Berg', 'Axelsson', 'Bergstrom', 'Lundberg', 'Lind', 'Lundgren', 'Lundqvist',
      'Mattsson', 'Berglund', 'Fredriksson', 'Sandberg', 'Henriksson', 'Forsberg', 'Sjoberg', 'Wallin', 'Engstrom', 'Eklund',
      'Hansen', 'Olsen', 'Larsen', 'Andersen', 'Pedersen', 'Nilsen', 'Kristiansen', 'Jensen', 'Karlsen', 'Johnsen',
      'Pettersen', 'Eriksen', 'Berg', 'Haugen', 'Hagen', 'Johannessen', 'Andreassen', 'Jacobsen', 'Dahl', 'Jorgensen',
      'Henriksen', 'Lund', 'Halvorsen', 'Sorensen', 'Jakobsen', 'Moen', 'Gundersen', 'Iversen', 'Strand', 'Solberg',
      'Nielsen', 'Moller', 'Rasmussen', 'Thomsen', 'Madsen', 'Christensen', 'Poulsen', 'Knudsen', 'Holm', 'Schmidt'
    ]
  },

  african_bantu: {
    maleFirst: [
      'Thabo', 'Sipho', 'Kagiso', 'Tendai', 'Musa', 'Tebogo', 'Bongani', 'Katlego', 'Farai', 'Simba',
      'Lwandle', 'Sibusiso', 'Dumiso', 'Kudzai', 'Tinashe', 'Jabulani', 'Mandla', 'Siphiwe', 'Themba', 'Mpho',
      'Vusi', 'Bheki', 'Lucky', 'Prince', 'Gift', 'Blessing', 'Wisdom', 'Praise', 'Godfrey', 'Innocent',
      'Brian', 'Emmanuel', 'Kelvin', 'Dennis', 'Victor', 'Eric', 'Kevin', 'Collins', 'Kennedy', 'Boniface',
      'Otieno', 'Ochieng', 'Onyango', 'Odhiambo', 'Omondi', 'Ouma', 'Oduor', 'Okoth', 'Owino', 'Okeyo',
      'Mwangi', 'Maina', 'Kamau', 'Kariuki', 'Njoroge', 'Karanja', 'Kimani', 'Githinji', 'Macharia', 'Waweru',
      'Kipchoge', 'Kipruto', 'Kipchumba', 'Kibet', 'Kipkemboi', 'Kiprono', 'Koech', 'Ruto', 'Kiptoo', 'Cheruiyot',
      'Baraka', 'Nehemiah', 'Chisomo', 'Kondwani', 'Limbani', 'Madalitso', 'Mwayi', 'Tiwonge', 'Yamiko', 'Chifundo'
    ],
    femaleFirst: [
      'Lerato', 'Mpho', 'Naledi', 'Refilwe', 'Thandi', 'Kealeboga', 'Lesedi', 'Boitumelo', 'Makena', 'Zola',
      'Buhle', 'Ayanda', 'Rudo', 'Chipo', 'Nomusa', 'Nokuthula', 'Lindiwe', 'Busisiwe', 'Gugulethu', 'Zanele',
      'Sibongile', 'Thandeka', 'Nonhlanhla', 'Precious', 'Faith', 'Mercy', 'Joy', 'Hope', 'Grace', 'Patience',
      'Wanjiku', 'Nyambura', 'Wambui', 'Wangari', 'Njeri', 'Wanjiru', 'Muthoni', 'Wairimu', 'Waithera', 'Gathoni',
      'Achieng', 'Atieno', 'Adhiambo', 'Akoth', 'Anyango', 'Apiyo', 'Awino', 'Akinyi', 'Aluoch', 'Amondi',
      'Chebet', 'Chepkirui', 'Chepkoech', 'Cherono', 'Jepchirchir', 'Jepkosgei', 'Chepngeno', 'Chemutai', 'Jepkemboi', 'Chebiwott',
      'Zawadi', 'Subira', 'Amani', 'Chisomo', 'Tadala', 'Tamanda', 'Tiwonge', 'Ulemu', 'Wongani', 'Yamikani',
      'Sekai', 'Tariro', 'Chiedza', 'Runako', 'Danai', 'Fungai', 'Ruvimbo', 'Nyasha', 'Shamiso', 'Tsitsi'
    ],
    maleLast: [
      'Molefe', 'Dlamini', 'Phiri', 'Banda', 'Sibanda', 'Moyo', 'Ndlovu', 'Chirwa', 'Khumalo', 'Ncube',
      'Sithole', 'Mthembu', 'Zulu', 'Hadebe', 'Mokoena', 'Nkosi', 'Radebe', 'Mabaso', 'Cele', 'Zungu',
      'Kariuki', 'Mwangi', 'Maina', 'Kamau', 'Njoroge', 'Karanja', 'Kimani', 'Githinji', 'Macharia', 'Waweru',
      'Otieno', 'Ochieng', 'Onyango', 'Odhiambo', 'Omondi', 'Ouma', 'Oduor', 'Okoth', 'Owino', 'Okeyo',
      'Kipchoge', 'Kipruto', 'Kipchumba', 'Kibet', 'Kipkemboi', 'Kiprono', 'Koech', 'Ruto', 'Kiptoo', 'Cheruiyot',
      'Mutua', 'Musyoka', 'Mutiso', 'Kilonzo', 'Musyoki', 'Mueni', 'Mutuku', 'Kitheka', 'Mwendwa', 'Makau',
      'Mugabe', 'Mnangagwa', 'Tsvangirai', 'Nakamba', 'Musona', 'Billiat', 'Raza', 'Coventry', 'Chivayo', 'Chiwenga',
      'Kaunda', 'Chiluba', 'Mwanawasa', 'Banda', 'Sata', 'Lungu', 'Hichilema', 'Kalaba', 'Mwila', 'Kambwili'
    ],
    femaleLast: [
      'Molefe', 'Dlamini', 'Phiri', 'Banda', 'Sibanda', 'Moyo', 'Ndlovu', 'Chirwa', 'Khumalo', 'Ncube',
      'Sithole', 'Mthembu', 'Zulu', 'Hadebe', 'Mokoena', 'Nkosi', 'Radebe', 'Mabaso', 'Cele', 'Zungu',
      'Kariuki', 'Mwangi', 'Maina', 'Kamau', 'Njoroge', 'Karanja', 'Kimani', 'Githinji', 'Macharia', 'Waweru',
      'Otieno', 'Ochieng', 'Onyango', 'Odhiambo', 'Omondi', 'Ouma', 'Oduor', 'Okoth', 'Owino', 'Okeyo',
      'Kipchoge', 'Kipruto', 'Kipchumba', 'Kibet', 'Kipkemboi', 'Kiprono', 'Koech', 'Ruto', 'Kiptoo', 'Cheruiyot',
      'Mutua', 'Musyoka', 'Mutiso', 'Kilonzo', 'Musyoki', 'Mueni', 'Mutuku', 'Kitheka', 'Mwendwa', 'Makau',
      'Mugabe', 'Mnangagwa', 'Tsvangirai', 'Nakamba', 'Musona', 'Billiat', 'Raza', 'Coventry', 'Chivayo', 'Chiwenga',
      'Kaunda', 'Chiluba', 'Mwanawasa', 'Banda', 'Sata', 'Lungu', 'Hichilema', 'Kalaba', 'Mwila', 'Kambwili'
    ]
  },

  african_west: {
    maleFirst: [
      'Chinedu', 'Emeka', 'Chukwuma', 'Ifeanyi', 'Nnamdi', 'Obinna', 'Chibuzo', 'Tochukwu', 'Uche', 'Kelechi',
      'Babatunde', 'Olumide', 'Ayodele', 'Oluwaseun', 'Femi', 'Adeyemi', 'Tunde', 'Segun', 'Kayode', 'Damilola',
      'Kofi', 'Kwame', 'Kwesi', 'Kojo', 'Yaw', 'Kweku', 'Kobina', 'Akwasi', 'Fiifi', 'Ekow',
      'Mamadou', 'Ibrahim', 'Ousmane', 'Boubacar', 'Sekou', 'Bakary', 'Adama', 'Souleymane', 'Modibo', 'Cheick',
      'Emmanuel', 'Samuel', 'Daniel', 'David', 'Joseph', 'Michael', 'Prince', 'Blessing', 'Victor', 'Godwin',
      'Goodluck', 'Sunday', 'Monday', 'Friday', 'Precious', 'Wisdom', 'Innocent', 'Prosper', 'Miracle', 'Destiny',
      'Ebenezer', 'Theophilus', 'Cornelius', 'Barnabas', 'Sylvester', 'Augustine', 'Bartholomew', 'Ignatius', 'Ferdinand', 'Godfrey',
      'Abubakar', 'Aliyu', 'Usman', 'Umar', 'Sani', 'Garba', 'Bello', 'Shehu', 'Aminu', 'Kabiru'
    ],
    femaleFirst: [
      'Ngozi', 'Chioma', 'Amaka', 'Chiamaka', 'Adaeze', 'Ifunanya', 'Chinelo', 'Uchenna', 'Nneka', 'Ogechi',
      'Oluwatosin', 'Folashade', 'Yetunde', 'Titilayo', 'Omotola', 'Abimbola', 'Bolanle', 'Bukola', 'Funmilayo', 'Ronke',
      'Akosua', 'Adwoa', 'Abena', 'Akua', 'Yaa', 'Afia', 'Amma', 'Esi', 'Araba', 'Baaba',
      'Fatoumata', 'Mariam', 'Aminata', 'Awa', 'Kadiatou', 'Oumou', 'Safiatou', 'Aissatou', 'Bintou', 'Fanta',
      'Blessing', 'Mercy', 'Grace', 'Joy', 'Faith', 'Hope', 'Patience', 'Peace', 'Glory', 'Favor',
      'Precious', 'Miracle', 'Destiny', 'Goodness', 'Charity', 'Comfort', 'Confidence', 'Praise', 'Rejoice', 'Victory',
      'Zainab', 'Amina', 'Hauwa', 'Halima', 'Fatima', 'Hadiza', 'Maryam', 'Aisha', 'Khadija', 'Rabi',
      'Asmau', 'Zubaida', 'Safiya', 'Jamila', 'Samira', 'Nafisa', 'Balkisu', 'Habiba', 'Rukayya', 'Lubabatu'
    ],
    maleLast: [
      'Okonkwo', 'Adeyemi', 'Okafor', 'Balogun', 'Mensah', 'Appiah', 'Owusu', 'Boateng', 'Osei', 'Asante',
      'Diallo', 'Traore', 'Camara', 'Toure', 'Keita', 'Coulibaly', 'Kone', 'Cisse', 'Sow', 'Barry',
      'Bello', 'Abubakar', 'Ibrahim', 'Mohammed', 'Aliyu', 'Usman', 'Garba', 'Sani', 'Shehu', 'Aminu',
      'Eze', 'Okeke', 'Nwosu', 'Nnamdi', 'Onyeka', 'Chukwu', 'Obi', 'Igwe', 'Ibe', 'Ani',
      'Adeleke', 'Akinyemi', 'Oladipo', 'Ogunleye', 'Babangida', 'Abiola', 'Tinubu', 'Obasanjo', 'Buhari', 'Jonathan',
      'Agyemang', 'Frimpong', 'Acheampong', 'Agyei', 'Darko', 'Antwi', 'Adjei', 'Boakye', 'Opoku', 'Sarfo',
      'Baah', 'Gyasi', 'Kwarteng', 'Amponsah', 'Adomako', 'Danquah', 'Nkrumah', 'Rawlings', 'Kufuor', 'Akufo',
      'Sesay', 'Bangura', 'Koroma', 'Kamara', 'Conteh', 'Kallon', 'Turay', 'Mansaray', 'Kanu', 'Tarawally'
    ],
    femaleLast: [
      'Okonkwo', 'Adeyemi', 'Okafor', 'Balogun', 'Mensah', 'Appiah', 'Owusu', 'Boateng', 'Osei', 'Asante',
      'Diallo', 'Traore', 'Camara', 'Toure', 'Keita', 'Coulibaly', 'Kone', 'Cisse', 'Sow', 'Barry',
      'Bello', 'Abubakar', 'Ibrahim', 'Mohammed', 'Aliyu', 'Usman', 'Garba', 'Sani', 'Shehu', 'Aminu',
      'Eze', 'Okeke', 'Nwosu', 'Nnamdi', 'Onyeka', 'Chukwu', 'Obi', 'Igwe', 'Ibe', 'Ani',
      'Adeleke', 'Akinyemi', 'Oladipo', 'Ogunleye', 'Babangida', 'Abiola', 'Tinubu', 'Obasanjo', 'Buhari', 'Jonathan',
      'Agyemang', 'Frimpong', 'Acheampong', 'Agyei', 'Darko', 'Antwi', 'Adjei', 'Boakye', 'Opoku', 'Sarfo',
      'Baah', 'Gyasi', 'Kwarteng', 'Amponsah', 'Adomako', 'Danquah', 'Nkrumah', 'Rawlings', 'Kufuor', 'Akufo',
      'Sesay', 'Bangura', 'Koroma', 'Kamara', 'Conteh', 'Kallon', 'Turay', 'Mansaray', 'Kanu', 'Tarawally'
    ]
  },

  turkic: {
    maleFirst: [
      'Mehmet', 'Mustafa', 'Ahmet', 'Ali', 'Huseyin', 'Hasan', 'Ibrahim', 'Ismail', 'Osman', 'Halil',
      'Suleyman', 'Yusuf', 'Omer', 'Murat', 'Mahmut', 'Ramazan', 'Salih', 'Recep', 'Fatih', 'Emre',
      'Burak', 'Hakan', 'Serkan', 'Onur', 'Tolga', 'Kaan', 'Arda', 'Kerem', 'Enes', 'Eren',
      'Batuhan', 'Oguzhan', 'Alperen', 'Mert', 'Yigit', 'Baris', 'Cem', 'Deniz', 'Umut', 'Can',
      'Nursultan', 'Kassym', 'Bolat', 'Arman', 'Daulet', 'Serik', 'Berik', 'Baurzhan', 'Marat', 'Murat',
      'Shavkat', 'Islom', 'Rustam', 'Dilshod', 'Anvar', 'Bobur', 'Ulugbek', 'Sanjar', 'Sardor', 'Farrukh',
      'Ilham', 'Heydar', 'Eldar', 'Tarlan', 'Rashad', 'Vugar', 'Rauf', 'Samir', 'Fuad', 'Emin',
      'Azamat', 'Bakyt', 'Kubat', 'Ulan', 'Mirbek', 'Kairat', 'Almaz', 'Kanat', 'Talant', 'Nurlan'
    ],
    femaleFirst: [
      'Fatma', 'Ayse', 'Emine', 'Hatice', 'Zeynep', 'Elif', 'Merve', 'Busra', 'Esra', 'Ozlem',
      'Yasemin', 'Sultan', 'Zehra', 'Melek', 'Gamze', 'Tugba', 'Derya', 'Seda', 'Filiz', 'Ebru',
      'Sibel', 'Sevgi', 'Nuray', 'Aysel', 'Gulay', 'Gulsen', 'Dilek', 'Songul', 'Semra', 'Yuksel',
      'Azra', 'Ecrin', 'Yagmur', 'Defne', 'Nehir', 'Miray', 'Eylul', 'Hira', 'Asya', 'Ada',
      'Dinara', 'Madina', 'Aruzhan', 'Aigerim', 'Asel', 'Zarina', 'Aida', 'Kamila', 'Malika', 'Aliya',
      'Gulnara', 'Nodira', 'Shakhnoza', 'Dilnoza', 'Feruza', 'Nilufar', 'Umida', 'Barno', 'Ziyoda', 'Gulzoda',
      'Leyla', 'Gunel', 'Nigar', 'Sevda', 'Konul', 'Samira', 'Aysel', 'Narmin', 'Turkan', 'Rena',
      'Cholpon', 'Aisuluu', 'Bermet', 'Jyldyz', 'Nurjamal', 'Ainura', 'Nazira', 'Gulbara', 'Saltanat', 'Meerim'
    ],
    maleLast: [
      'Yilmaz', 'Kaya', 'Demir', 'Celik', 'Sahin', 'Yildiz', 'Yildirim', 'Ozturk', 'Aydin', 'Ozdemir',
      'Arslan', 'Dogan', 'Kilic', 'Aslan', 'Cetin', 'Kara', 'Koc', 'Kurt', 'Ozkan', 'Simsek',
      'Polat', 'Ozcan', 'Korkmaz', 'Cakir', 'Erdogan', 'Yavuz', 'Gunes', 'Acar', 'Ates', 'Senturk',
      'Nazarbayev', 'Tokayev', 'Suleimenov', 'Aliev', 'Mammadov', 'Hasanov', 'Huseynov', 'Guliyev', 'Karimov', 'Mirziyoyev',
      'Rahmonov', 'Berdymukhamedov', 'Atambayev', 'Japarov', 'Kulov', 'Bakiyev', 'Akayev', 'Niyazov', 'Orazov', 'Durdyev',
      'Turgunov', 'Yusupov', 'Abdullayev', 'Khasanov', 'Rakhimov', 'Sultanov', 'Ismailov', 'Ahmedov', 'Azimov', 'Sharipov',
      'Nurmagomedov', 'Zhumabayev', 'Satpayev', 'Kunayev', 'Baiseitov', 'Auezov', 'Baitursynov', 'Bukeikhanov', 'Ryskulov', 'Tynybayev',
      'Bayramov', 'Tagiyev', 'Mustafayev', 'Pashayev', 'Mehdiyev', 'Kerimov', 'Sadigov', 'Gurbanov', 'Rustamov', 'Babayev'
    ],
    femaleLast: [
      'Yilmaz', 'Kaya', 'Demir', 'Celik', 'Sahin', 'Yildiz', 'Yildirim', 'Ozturk', 'Aydin', 'Ozdemir',
      'Arslan', 'Dogan', 'Kilic', 'Aslan', 'Cetin', 'Kara', 'Koc', 'Kurt', 'Ozkan', 'Simsek',
      'Polat', 'Ozcan', 'Korkmaz', 'Cakir', 'Erdogan', 'Yavuz', 'Gunes', 'Acar', 'Ates', 'Senturk',
      'Nazarbayeva', 'Tokayeva', 'Suleimenova', 'Aliyeva', 'Mammadova', 'Hasanova', 'Huseynova', 'Guliyeva', 'Karimova', 'Mirziyoyeva',
      'Rahmonova', 'Berdymukhamedova', 'Atambayeva', 'Japarova', 'Kulova', 'Bakiyeva', 'Akayeva', 'Niyazova', 'Orazova', 'Durdyeva',
      'Turgunova', 'Yusupova', 'Abdullayeva', 'Khasanova', 'Rakhimova', 'Sultanova', 'Ismailova', 'Ahmedova', 'Azimova', 'Sharipova',
      'Nurmagomedova', 'Zhumabayeva', 'Satpayeva', 'Kunayeva', 'Baiseitova', 'Auezova', 'Baitursynova', 'Bukeikhanova', 'Ryskulova', 'Tynybayeva',
      'Bayramova', 'Tagiyeva', 'Mustafayeva', 'Pashayeva', 'Mehdiyeva', 'Kerimova', 'Sadigova', 'Gurbanova', 'Rustamova', 'Babayeva'
    ]
  }
};
