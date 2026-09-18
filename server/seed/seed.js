const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Enrollment = require('../models/Enrollment');
const Notification = require('../models/Notification');

const SEED_PASSWORD = process.env.SEED_PASSWORD || 'Password123!';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Course.deleteMany({}),
      Module.deleteMany({}),
      Lesson.deleteMany({}),
      Quiz.deleteMany({}),
      Enrollment.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: SEED_PASSWORD,
      role: 'admin',
      isActive: true,
      isVerified: true,
      bio: 'Platform administrator',
    });

    const teacher1 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'teacher@example.com',
      password: SEED_PASSWORD,
      role: 'teacher',
      isActive: true,
      isVerified: true,
      bio: 'Senior Software Engineer with 10+ years of experience in web development. Passionate about teaching modern technologies.',
    });

    const teacher2 = await User.create({
      name: 'Prof. Michael Chen',
      email: 'teacher2@example.com',
      password: SEED_PASSWORD,
      role: 'teacher',
      isActive: true,
      isVerified: true,
      bio: 'Data Science expert and ML researcher. Published author with expertise in Python and AI.',
    });

    const student1 = await User.create({
      name: 'Alex Rivera',
      email: 'student@example.com',
      password: SEED_PASSWORD,
      role: 'student',
      isActive: true,
      isVerified: true,
      bio: 'Aspiring full-stack developer learning modern web technologies.',
    });

    const student2 = await User.create({
      name: 'Emma Watson',
      email: 'student2@example.com',
      password: SEED_PASSWORD,
      role: 'student',
      isActive: true,
      isVerified: true,
      bio: 'Computer science student passionate about AI and data science.',
    });

    const student3 = await User.create({
      name: 'James Kim',
      email: 'student3@example.com',
      password: SEED_PASSWORD,
      role: 'student',
      isActive: true,
      isVerified: true,
      bio: 'Self-taught developer transitioning from marketing to tech.',
    });

    console.log('Created users');

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Web Development', description: 'Frontend, backend, and full-stack web development', icon: 'Globe' },
      { name: 'Data Science', description: 'Data analysis, visualization, and machine learning', icon: 'BarChart' },
      { name: 'Mobile Development', description: 'iOS and Android app development', icon: 'Smartphone' },
      { name: 'DevOps', description: 'CI/CD, cloud, and infrastructure', icon: 'Server' },
      { name: 'UI/UX Design', description: 'User interface and user experience design', icon: 'Palette' },
      { name: 'Cybersecurity', description: 'Security practices, ethical hacking', icon: 'Shield' },
    ]);
    console.log('Created categories');

    // Create courses
    const course1 = await Course.create({
      title: 'Complete React.js Masterclass 2024',
      description: 'Learn React.js from scratch to advanced concepts including hooks, context, Redux, and real-world projects. This comprehensive course covers everything you need to become a proficient React developer.',
      category: categories[0]._id,
      teacher: teacher1._id,
      price: 0,
      level: 'beginner',
      duration: '40 hours',
      status: 'published',
      requirements: ['Basic HTML & CSS knowledge', 'JavaScript fundamentals', 'A computer with internet access'],
      learningOutcomes: ['Build modern React applications', 'Master React Hooks and Context API', 'State management with Redux', 'Build and deploy real-world projects'],
      enrolledStudents: 3,
      rating: 4.8,
      totalRatings: 45,
    });

    const course2 = await Course.create({
      title: 'Node.js & Express Backend Development',
      description: 'Master backend development with Node.js and Express. Learn REST APIs, authentication, database integration, and deployment strategies for production applications.',
      category: categories[0]._id,
      teacher: teacher1._id,
      price: 0,
      level: 'intermediate',
      duration: '35 hours',
      status: 'published',
      requirements: ['JavaScript knowledge', 'Basic understanding of web development', 'Node.js installed on your machine'],
      learningOutcomes: ['Build RESTful APIs', 'Implement JWT authentication', 'Work with MongoDB and Mongoose', 'Deploy Node.js applications'],
      enrolledStudents: 2,
      rating: 4.6,
      totalRatings: 32,
    });

    const course3 = await Course.create({
      title: 'Python for Data Science & Machine Learning',
      description: 'Comprehensive data science course covering Python, NumPy, Pandas, Matplotlib, Scikit-learn, and TensorFlow. From data analysis to building ML models.',
      category: categories[1]._id,
      teacher: teacher2._id,
      price: 0,
      level: 'intermediate',
      duration: '50 hours',
      status: 'published',
      requirements: ['Basic programming knowledge', 'High school math', 'Willingness to learn'],
      learningOutcomes: ['Python for data analysis', 'Data visualization with Matplotlib', 'Machine learning with Scikit-learn', 'Deep learning fundamentals'],
      enrolledStudents: 2,
      rating: 4.9,
      totalRatings: 58,
    });

    const course4 = await Course.create({
      title: 'Advanced CSS & Modern UI Design',
      description: 'Master advanced CSS techniques, animations, responsive design, CSS Grid, Flexbox, and modern UI patterns for building beautiful web interfaces.',
      category: categories[4]._id,
      teacher: teacher1._id,
      price: 0,
      level: 'advanced',
      duration: '25 hours',
      status: 'published',
      requirements: ['HTML & CSS basics', 'Understanding of web browsers'],
      learningOutcomes: ['Advanced CSS layouts', 'CSS animations and transitions', 'Responsive design patterns', 'Modern UI component design'],
      enrolledStudents: 1,
      rating: 4.7,
      totalRatings: 21,
    });

    const course5 = await Course.create({
      title: 'Docker & Kubernetes for Developers',
      description: 'Learn containerization with Docker and orchestration with Kubernetes. Deploy and manage scalable applications in the cloud.',
      category: categories[3]._id,
      teacher: teacher2._id,
      price: 0,
      level: 'advanced',
      duration: '30 hours',
      status: 'draft',
      requirements: ['Linux basics', 'Command line experience', 'Basic networking knowledge'],
      learningOutcomes: ['Docker fundamentals', 'Container orchestration', 'Kubernetes deployment', 'CI/CD with containers'],
      enrolledStudents: 0,
    });

    console.log('Created courses');

    // Create modules and lessons for Course 1 (React)
    const m1_1 = await Module.create({ course: course1._id, title: 'Introduction to React', description: 'Getting started with React.js', order: 0 });
    const m1_2 = await Module.create({ course: course1._id, title: 'React Hooks Deep Dive', description: 'Master all React hooks', order: 1 });
    const m1_3 = await Module.create({ course: course1._id, title: 'State Management', description: 'Context API and Redux', order: 2 });

    // Lessons for Module 1
    await Lesson.create({ module: m1_1._id, title: 'What is React?', description: 'Introduction to React library and its ecosystem', type: 'video', videoUrl: 'https://www.youtube.com/embed/Tn6-PIqc4UM', duration: '15 min', order: 0, isPreview: true });
    await Lesson.create({ module: m1_1._id, title: 'Setting Up Your Development Environment', description: 'Install Node.js, VS Code, and create your first React app', type: 'text', content: '<h2>Setting Up React</h2><p>In this lesson, we will set up our development environment for React development.</p><h3>Prerequisites</h3><ul><li>Node.js (v18+)</li><li>VS Code or any code editor</li><li>Git</li></ul><h3>Create React App</h3><p>Run the following command to create a new React project:</p><pre><code>npx create-vite@latest my-app -- --template react</code></pre><p>This will scaffold a new React project using Vite as the build tool.</p><h3>Project Structure</h3><p>After creating the project, you will see the following structure:</p><ul><li><strong>src/</strong> - Source code directory</li><li><strong>public/</strong> - Static assets</li><li><strong>package.json</strong> - Project configuration</li><li><strong>vite.config.js</strong> - Vite configuration</li></ul>', duration: '20 min', order: 1 });
    const l1_3 = await Lesson.create({ module: m1_1._id, title: 'JSX and Components', description: 'Understanding JSX syntax and React components', type: 'video', videoUrl: 'https://www.youtube.com/embed/Tn6-PIqc4UM', duration: '25 min', order: 2 });

    // Lessons for Module 2
    await Lesson.create({ module: m1_2._id, title: 'useState Hook', description: 'Managing component state with useState', type: 'video', videoUrl: 'https://www.youtube.com/embed/O6P86uwfdR0', duration: '20 min', order: 0 });
    await Lesson.create({ module: m1_2._id, title: 'useEffect Hook', description: 'Side effects and lifecycle management', type: 'video', videoUrl: 'https://www.youtube.com/embed/O6P86uwfdR0', duration: '30 min', order: 1 });
    await Lesson.create({ module: m1_2._id, title: 'Custom Hooks', description: 'Building reusable custom hooks', type: 'text', content: '<h2>Custom Hooks</h2><p>Custom hooks allow you to extract component logic into reusable functions.</p><h3>Rules</h3><ol><li>Name must start with "use"</li><li>Can call other hooks</li><li>Must be called at the top level</li></ol><pre><code>function useCounter(initialValue = 0) {\n  const [count, setCount] = useState(initialValue);\n  const increment = () => setCount(c => c + 1);\n  const decrement = () => setCount(c => c - 1);\n  return { count, increment, decrement };\n}</code></pre>', duration: '25 min', order: 2 });

    // Lessons for Module 3
    await Lesson.create({ module: m1_3._id, title: 'Context API', description: 'Global state with React Context', type: 'video', videoUrl: 'https://www.youtube.com/embed/5LrDIWkK_Bc', duration: '35 min', order: 0 });
    await Lesson.create({ module: m1_3._id, title: 'Redux Toolkit', description: 'State management at scale', type: 'video', videoUrl: 'https://www.youtube.com/embed/5LrDIWkK_Bc', duration: '40 min', order: 1 });

    // Create modules and lessons for Course 2 (Node.js)
    const m2_1 = await Module.create({ course: course2._id, title: 'Node.js Fundamentals', order: 0 });
    const m2_2 = await Module.create({ course: course2._id, title: 'Express.js Framework', order: 1 });

    await Lesson.create({ module: m2_1._id, title: 'Introduction to Node.js', type: 'video', videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4', duration: '20 min', order: 0, isPreview: true });
    await Lesson.create({ module: m2_1._id, title: 'Node.js Modules', type: 'text', content: '<h2>Node.js Module System</h2><p>Node.js uses CommonJS modules by default. Learn about require, exports, and the module system.</p>', duration: '15 min', order: 1 });
    await Lesson.create({ module: m2_2._id, title: 'Building REST APIs', type: 'video', videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4', duration: '30 min', order: 0 });
    await Lesson.create({ module: m2_2._id, title: 'Middleware in Express', type: 'video', videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4', duration: '25 min', order: 1 });

    // Create modules and lessons for Course 3 (Python)
    const m3_1 = await Module.create({ course: course3._id, title: 'Python Basics for Data Science', order: 0 });
    const m3_2 = await Module.create({ course: course3._id, title: 'Data Analysis with Pandas', order: 1 });

    await Lesson.create({ module: m3_1._id, title: 'Python Setup & Environment', type: 'video', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', duration: '15 min', order: 0, isPreview: true });
    await Lesson.create({ module: m3_1._id, title: 'NumPy Essentials', type: 'video', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', duration: '30 min', order: 1 });
    await Lesson.create({ module: m3_2._id, title: 'Introduction to Pandas', type: 'video', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', duration: '35 min', order: 0 });
    await Lesson.create({ module: m3_2._id, title: 'Data Cleaning & Transformation', type: 'text', content: '<h2>Data Cleaning with Pandas</h2><p>Learn essential data cleaning techniques including handling missing values, duplicates, and data type conversions.</p><h3>Key Operations</h3><ul><li>dropna() - Remove missing values</li><li>fillna() - Fill missing values</li><li>astype() - Convert data types</li><li>drop_duplicates() - Remove duplicate rows</li></ul>', duration: '25 min', order: 1 });

    // Modules for Course 4
    const m4_1 = await Module.create({ course: course4._id, title: 'Advanced Layouts', order: 0 });
    await Lesson.create({ module: m4_1._id, title: 'CSS Grid Mastery', type: 'video', videoUrl: 'https://www.youtube.com/embed/EiNiSFIPIQE', duration: '30 min', order: 0, isPreview: true });
    await Lesson.create({ module: m4_1._id, title: 'Flexbox Advanced Patterns', type: 'video', videoUrl: 'https://www.youtube.com/embed/EiNiSFIPIQE', duration: '25 min', order: 1 });

    console.log('Created modules and lessons');

    // Create quizzes
    const quiz1 = await Quiz.create({
      course: course1._id,
      title: 'React Fundamentals Quiz',
      description: 'Test your understanding of React basics',
      timeLimit: 15,
      passingScore: 60,
      attemptsAllowed: 3,
      questions: [
        {
          questionText: 'What is React?',
          options: ['A CSS framework', 'A JavaScript library for building UIs', 'A database', 'A server-side language'],
          correctAnswer: 1,
          marks: 2,
          explanation: 'React is a JavaScript library developed by Facebook for building user interfaces.',
        },
        {
          questionText: 'What is JSX?',
          options: ['A JavaScript extension', 'A syntax extension for JavaScript that looks like HTML', 'A CSS preprocessor', 'A testing framework'],
          correctAnswer: 1,
          marks: 2,
          explanation: 'JSX stands for JavaScript XML, allowing you to write HTML-like syntax in JavaScript.',
        },
        {
          questionText: 'Which hook is used for state management in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useRef'],
          correctAnswer: 1,
          marks: 2,
          explanation: 'useState is the hook used to add state to functional components.',
        },
        {
          questionText: 'React components must return a single root element.',
          options: ['True', 'False'],
          correctAnswer: 0,
          marks: 1,
          explanation: 'React components must return a single root element, though you can use Fragments (<></>) to avoid extra DOM nodes.',
        },
        {
          questionText: 'What does the useEffect hook replace in class components?',
          options: ['constructor', 'render', 'Lifecycle methods', 'setState'],
          correctAnswer: 2,
          marks: 2,
          explanation: 'useEffect combines componentDidMount, componentDidUpdate, and componentWillUnmount.',
        },
      ],
    });

    const quiz2 = await Quiz.create({
      course: course2._id,
      title: 'Node.js & Express Quiz',
      description: 'Test your Node.js and Express knowledge',
      timeLimit: 10,
      passingScore: 50,
      attemptsAllowed: 3,
      questions: [
        {
          questionText: 'Node.js is built on which JavaScript engine?',
          options: ['SpiderMonkey', 'V8', 'Chakra', 'JavaScriptCore'],
          correctAnswer: 1,
          marks: 2,
          explanation: 'Node.js is built on Chrome\'s V8 JavaScript engine.',
        },
        {
          questionText: 'Express.js is a framework for Node.js.',
          options: ['True', 'False'],
          correctAnswer: 0,
          marks: 1,
          explanation: 'Express.js is a minimal and flexible Node.js web application framework.',
        },
        {
          questionText: 'Which method is used to create a route in Express?',
          options: ['app.route()', 'app.get()', 'app.create()', 'app.path()'],
          correctAnswer: 1,
          marks: 2,
          explanation: 'app.get(), app.post(), app.put(), and app.delete() are used to create routes in Express.',
        },
      ],
    });

    console.log('Created quizzes');

    // Create enrollments
    await Enrollment.create({ student: student1._id, course: course1._id, progress: 38, completedLessons: [l1_3._id], lastAccessedLesson: l1_3._id });
    await Enrollment.create({ student: student1._id, course: course2._id, progress: 0 });
    await Enrollment.create({ student: student1._id, course: course3._id, progress: 0 });
    await Enrollment.create({ student: student2._id, course: course1._id, progress: 0 });
    await Enrollment.create({ student: student2._id, course: course3._id, progress: 25 });
    await Enrollment.create({ student: student3._id, course: course1._id, progress: 0 });
    await Enrollment.create({ student: student3._id, course: course2._id, progress: 50 });
    await Enrollment.create({ student: student3._id, course: course4._id, progress: 0 });

    console.log('Created enrollments');

    // Create some notifications
    await Notification.insertMany([
      { recipient: student1._id, sender: teacher1._id, title: 'Welcome to React Masterclass!', message: 'Welcome to the course. Start with the first module.', type: 'enrollment' },
      { recipient: student1._id, sender: admin._id, title: 'Platform Update', message: 'We have added new features to the platform.', type: 'general' },
      { recipient: teacher1._id, sender: student1._id, title: 'New Enrollment', message: 'Alex Rivera enrolled in React Masterclass', type: 'enrollment' },
    ]);

    console.log('Created notifications');

    console.log('\n========================================');
    console.log('  Database seeded successfully!');
    console.log('========================================');
    console.log('\nDemo Accounts:');
    console.log(`  Admin:   admin@example.com / ${SEED_PASSWORD}`);
    console.log(`  Teacher: teacher@example.com / ${SEED_PASSWORD}`);
    console.log(`  Student: student@example.com / ${SEED_PASSWORD}`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
