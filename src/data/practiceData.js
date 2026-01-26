
export const keySequences = {
  en: {
    easy: {
      
      homeRowLeft: [
        'aaaa', 'ssss', 'dddd', 'ffff',
        'asdf', 'fdsa', 'asdf fdsa', 'fdsa asdf',
        'a s d f', 'f d s a', 'as df', 'fd sa',
        'aassddff', 'ffddssaa', 'asdfasdf', 'fdsafdsa',
      ],
      
      homeRowRight: [
        'jjjj', 'kkkk', 'llll', ';;;;',
        'jkl;', ';lkj', 'jkl; ;lkj', ';lkj jkl;',
        'j k l ;', '; l k j', 'jk l;', ';l kj',
        'jjkkll;;', ';;llkkjj', 'jkl;jkl;', ';lkj;lkj',
      ],
      
      homeRowBoth: [
        'asdf jkl;', 'jkl; asdf', 'fdsa ;lkj', ';lkj fdsa',
        'asdf jkl; fdsa ;lkj', 'f j f j', 'd k d k', 's l s l',
        'a ; a ;', 'fj fj fj', 'dk dk dk', 'sl sl sl',
        'asdf jkl; asdf jkl;', 'fdsa ;lkj fdsa ;lkj',
      ],
      
      topRowLeft: [
        'qqqq', 'wwww', 'eeee', 'rrrr', 'tttt',
        'qwert', 'trewq', 'qwert trewq', 'trewq qwert',
        'q w e r t', 't r e w q', 'qw er', 'tr ew',
        'qqww eerr tt', 'ttrr eeww qq',
      ],
      
      topRowRight: [
        'yyyy', 'uuuu', 'iiii', 'oooo', 'pppp',
        'yuiop', 'poiuy', 'yuiop poiuy', 'poiuy yuiop',
        'y u i o p', 'p o i u y', 'yu io', 'po iu',
        'yyuu iioo pp', 'ppoo iiuu yy',
      ],
      
      topRowBoth: [
        'qwert yuiop', 'yuiop qwert', 'trewq poiuy', 'poiuy trewq',
        'qwert yuiop trewq poiuy', 'q y q y', 'w u w u', 'e i e i',
        'r o r o', 't p t p', 'qy qy qy', 'wu wu wu',
      ],
      
      bottomRowLeft: [
        'zzzz', 'xxxx', 'cccc', 'vvvv', 'bbbb',
        'zxcvb', 'bvcxz', 'zxcvb bvcxz', 'bvcxz zxcvb',
        'z x c v b', 'b v c x z', 'zx cv', 'bv cx',
        'zzxx ccvv bb', 'bbvv ccxx zz',
      ],
      
      bottomRowRight: [
        'nnnn', 'mmmm', ',,,,', '....', '////',
        'nm,./', './,mn', 'nm,./ ./,mn', './,mn nm,./',
        'n m , . /', '/ . , m n', 'nm ,.', './ ,m',
        'nnmm ,,.. //', '//.. ,,mm nn',
      ],
      
      bottomRowBoth: [
        'zxcvb nm,./', 'nm,./ zxcvb', 'bvcxz ./,mn', './,mn bvcxz',
        'zxcvb nm,./ bvcxz ./,mn', 'z n z n', 'x m x m', 'c , c ,',
        'v . v .', 'b / b /', 'zn zn zn', 'xm xm xm',
      ],
      
      simpleWords: [
        'as', 'ad', 'ask', 'dad', 'sad', 'fad', 'lad', 'add',
        'all', 'fall', 'sass', 'lass', 'jazz', 'fizz', 'dazzle',
        'jade', 'fade', 'safe', 'sake', 'lake', 'jake', 'fake',
      ],
    },
    medium: {
      
      numbersLeft: [
        '1111', '2222', '3333', '4444', '5555',
        '12345', '54321', '12345 54321', '54321 12345',
        '1 2 3 4 5', '5 4 3 2 1', '12 34', '54 32',
        'a1 s2 d3 f4 f5', 'f5 f4 d3 s2 a1',
        'a1a1 s2s2 d3d3 f4f4 f5f5',
        'the1 cat2 dog3', 'test1 test2 test3',
      ],
      
      numbersRight: [
        '6666', '7777', '8888', '9999', '0000',
        '67890', '09876', '67890 09876', '09876 67890',
        '6 7 8 9 0', '0 9 8 7 6', '67 89', '09 87',
        'j6 k7 l8 ;9 ;0', ';0 ;9 l8 k7 j6',
        'j6j6 k7k7 l8l8 ;9;9 ;0;0',
        'test6 test7 test8', 'code9 code0',
      ],
      
      numbersBoth: [
        '12345 67890', '67890 12345', '54321 09876', '09876 54321',
        '1 6 2 7 3 8 4 9 5 0', 'a1 j6 s2 k7 d3 l8',
        'test1 test6 test2 test7', 'code3 code8 code4 code9',
        '123 456 789 0', '987 654 321',
      ],
      
      capitals: [
        'A S D F', 'J K L ;', 'Q W E R T', 'Y U I O P',
        'The Quick', 'Brown Fox', 'Jump Over', 'Lazy Dog',
        'ASDF JKL;', 'QWERT YUIOP', 'ZXCVB NM,./',
        'A a A a', 'B b B b', 'C c C c', 'D d D d',
        'Test Test', 'Code Code', 'Type Type', 'Fast Fast',
        'The Cat', 'Big Dog', 'Red Car', 'Blue Sky',
      ],
      
      punctuation: [
        'test, test', 'test. test', 'test; test', 'test: test',
        'test? test', 'test! test', 'test\'s test', 'test-test',
        'test, test. test; test:', 'test? test! test\'s test-test',
        'hello, world', 'yes! no?', 'stop. go:', 'test\'s code',
        'a, b, c, d', 'one. two. three.', 'why? because!',
        
        'it\'s', 'don\'t', 'won\'t', 'can\'t', 'isn\'t',
        'he\'s', 'she\'s', 'we\'re', 'they\'re', 'you\'re',
        'mom\'s', 'dad\'s', 'cat\'s', 'dog\'s', 'book\'s',
        
        'yes, no', 'one, two', 'first, second', 'a, b, c',
        'test, code, file', 'hello, world, people',
        
        'test, test.', 'code, code.', 'file, file.',
        
        'what?', 'why?', 'where?', 'when?', 'how?',
        'yes!', 'no!', 'stop!', 'go!', 'wait!',
        
        'test; code', 'file; document', 'first; second',
        'test: code', 'file: document', 'time: 12:00',
        
        'test/test', 'code/file', 'path/to/file',
        'test\\test', 'code\\file', 'path\\to\\file',
      ],
      
      letterCombinations: [
        'th th th', 'he he he', 'in in in', 'er er er',
        'an an an', 're re re', 'ed ed ed', 'nd nd nd',
        'ou ou ou', 'ea ea ea', 'to to to', 'it it it',
        'is is is', 'or or or', 'ti ti ti', 'as as as',
        'the the the', 'and and and', 'for for for', 'are are are',
        'that that that', 'this this this', 'with with with',
        'ck ck ck', 'ch ch ch', 'ph ph ph', 'gh gh gh',
        'tion tion tion', 'ing ing ing', 'ous ous ous',
      ],
      
      mixedRows: [
        'qaz wsx edc', 'rfv tgb yhn', 'ujm ik, ol.', 'p;/',
        'qwert asdf zxcv', 'yuiop jkl; nm,./',
        'q a z w s x e d c', 'r f v t g b y h n',
        'asdf qwert', 'jkl; yuiop', 'zxcvb qwerty',
      ],
      
      commonWords: [
        'the quick brown', 'fox jumps over', 'lazy dog',
        'pack my box', 'with five dozen', 'liquor jugs',
        'sphinx of black', 'quartz judge my', 'vow',
        'practice makes', 'perfect when', 'learning new',
      ],
    },
    hard: {
      
      numbersAdvanced: [
        'test123 test456', 'code789 code0', 'a1b2c3 d4e5f6',
        '123abc 456def', '789ghi 0jkl', 'test1a test2b test3c',
        '2024 2025 2026', '100 200 300', '1.5 2.5 3.5',
        'version1.0 version2.0', 'test-123 test-456',
        'item1, item2, item3', 'price: $100, $200, $300',
      ],
      
      capitalsAdvanced: [
        'The Quick Brown Fox', 'Jumps Over The Lazy Dog',
        'Practice Makes Perfect', 'When Learning New Skills',
        'JavaScript Python Rust', 'HTML CSS React Vue',
        'API REST GraphQL', 'JSON XML YAML',
        'USA UK EU', 'NASA FBI CIA', 'HTTP HTTPS FTP',
        'Mr. Mrs. Dr.', 'Jan. Feb. Mar.', 'Mon. Tue. Wed.',
      ],
      
      punctuationAdvanced: [
        'test, test; test: test.', 'test? test! test\'s test-test',
        'hello, world!', 'yes, no; maybe?', 'stop. go: wait!',
        'test\'s code\'s', 'don\'t won\'t can\'t', 'it\'s he\'s she\'s',
        'test-test-test', 'test_test_test', 'test.test.test',
        'test, test, and test.', 'test; test; test:', 'test? test! test.',
        'price: $100.50', 'date: 12/31/2024', 'time: 3:45 PM',
        'email@example.com', 'https://www.example.com',
        'test (parentheses)', 'test [brackets]', 'test {braces}',
        
        'mom\'s book', 'dad\'s car', 'cat\'s toy', 'dog\'s bowl',
        'don\'t, won\'t, can\'t', 'it\'s not', 'he\'s not',
        
        'first, second, third, fourth', 'yes, no, maybe, I don\'t know',
        'test, code, file, document', 'a, b, c, d, e, f',
        
        'test, test; test: test. test? test!',
        'hello, world! how are you? I\'m fine.',
        'yes, no; maybe? I don\'t know!',
        
        'he said: "hello, world!"', 'it\'s "test"',
        'mom\'s "book"', 'dad\'s "car"',
        
        'test (with parentheses)', 'test [with brackets]', 'test {with braces}',
        'test <with angle>', 'test "with quotes"', 'test \'with apostrophes\'',
      ],
      
      symbols: [
        '! @ # $ %', '% $ # @ !', '^ & * ( )', ') ( * & ^',
        'test! test@ test#', 'test$ test% test^', 'test& test*',
        'test(test)', 'test[test]', 'test{test}', 'test<test>',
        'test+test', 'test-test', 'test=test', 'test_test',
        'test|test', 'test\\test', 'test/test', 'test?test',
        'test~test', 'test`test', 'test\'test', 'test"test',
        'code += 1', 'value -= 2', 'result *= 3', 'total /= 4',
        'x == y', 'a != b', 'c <= d', 'e >= f',
        'if (x && y)', 'if (a || b)', 'if (!c)',
      ],
      
      complexCombinations: [
        'tion tion tion', 'ing ing ing', 'ous ous ous', 'ion ion ion',
        'ck ch ph gh', 'th sh wh qu', 'str spr scr', 'bl cl fl gl',
        'br cr dr fr', 'tr pr gr', 'sp st sk', 'sw tw dw',
        'the quick brown', 'fox jumps over', 'lazy dog',
        'sphinx of black', 'quartz judge my', 'vow',
        'jaded zombies', 'acted quaintly', 'but kept driving',
      ],
      
      programming: [
        'function test()', 'const x = 1', 'let y = 2', 'var z = 3',
        'if (condition)', 'else if (other)', 'for (let i = 0)',
        'return value', 'console.log()', 'document.getElementById()',
        'test1 && test2', 'test3 || test4', '!test5',
        'x += 1', 'y -= 2', 'z *= 3', 'w /= 4',
        'test === value', 'test !== other', 'test <= max',
        'import { test }', 'export default', 'class Test {}',
        'async function', 'await promise', 'try { } catch',
      ],
      
      mixedAdvanced: [
        'Test123, test456!', 'Code789; code0:', 'API v1.0, v2.0',
        'The quick brown fox jumps over the lazy dog!',
        'Practice makes perfect when learning new skills.',
        'JavaScript, Python, and Rust are popular languages.',
        'Email: test@example.com, Phone: (555) 123-4567',
        'Price: $100.50, Date: 12/31/2024, Time: 3:45 PM',
        'if (x && y) { return z; }', 'const test = () => {}',
        'The 5 quick brown foxes jumped over the 3 lazy dogs!',
      ],
    },
  },
  uk: {
    easy: {
      
      homeRowLeft: [
        'фффф', 'іііі', 'вввв', 'аааа',
        'фіва', 'авіф', 'фіва авіф', 'авіф фіва',
        'ф і в а', 'а в і ф', 'фі ва', 'ав іф',
        'ффіі вваа', 'аавв ііфф', 'фівафіва', 'авіфавіф',
      ],
      
      homeRowRight: [
        'пппп', 'рррр', 'оооо', 'лллл',
        'прол', 'лроп', 'прол лроп', 'лроп прол',
        'п р о л', 'л о р п', 'пр ол', 'лр оп',
        'ппрроолл', 'ллооррпп', 'пролпрол', 'лроплроп',
      ],
      
      homeRowBoth: [
        'фіва прол', 'прол фіва', 'авіф лроп', 'лроп авіф',
        'фіва прол авіф лроп', 'ф п ф п', 'в р в р', 'і о і о',
        'а л а л', 'фп фп фп', 'вр вр вр', 'іо іо іо',
        'фіва прол фіва прол', 'авіф лроп авіф лроп',
      ],
      
      topRowLeft: [
        'йййй', 'цццц', 'уууу', 'кккк', 'ееее',
        'йцуке', 'екцуй', 'йцуке екцуй', 'екцуй йцуке',
        'й ц у к е', 'е к у ц й', 'йц ук', 'ек уц',
        'ййцц уукк ее', 'еекк ууцц йй',
      ],
      
      topRowRight: [
        'нннн', 'гггг', 'шшшш', 'щщщщ',
        'нгшщ', 'щшгн', 'нгшщ щшгн', 'щшгн нгшщ',
        'н г ш щ', 'щ ш г н', 'нг шщ', 'щш гн',
        'ннгг шшщщ', 'щщшш ггнн',
      ],
      
      topRowBoth: [
        'йцуке нгшщ', 'нгшщ йцуке', 'екцуй щшгн', 'щшгн екцуй',
        'йцуке нгшщ екцуй щшгн', 'й н й н', 'ц г ц г', 'у ш у ш',
        'к щ к щ', 'е н е н', 'йн йн йн', 'цг цг цг',
      ],
      
      bottomRowLeft: [
        'яяяя', 'чччч', 'сссс', 'мммм', 'ииии',
        'ячсми', 'имсчя', 'ячсми имсчя', 'имсчя ячсми',
        'я ч с м и', 'и м с ч я', 'яч см', 'им сч',
        'яячч ссмм ии', 'иимм ссчч яя',
      ],
      
      bottomRowRight: [
        'тттт', 'іііі', 'ьььь', 'бббб', 'юююю',
        'тіьбю', 'юбьіт', 'тіьбю юбьіт', 'юбьіт тіьбю',
        'т і ь б ю', 'ю б ь і т', 'ті ьб', 'юб ьі',
        'ттіі ььбб юю', 'ююбб ььіі тт',
      ],
      
      bottomRowBoth: [
        'ячсми тіьбю', 'тіьбю ячсми', 'имсчя юбьіт', 'юбьіт имсчя',
        'ячсми тіьбю имсчя юбьіт', 'я т я т', 'ч і ч і', 'с ь с ь',
        'м б м б', 'и ю и ю', 'ят ят ят', 'чі чі чі',
      ],
      
      simpleWords: [
        'фі', 'ва', 'пр', 'ол', 'фіва', 'прол', 'авіф', 'лроп',
        'фівапрол', 'пролфіва', 'авіфлроп', 'лропавіф',
      ],
    },
    medium: {
      
      numbersLeft: [
        '1111', '2222', '3333', '4444', '5555',
        '12345', '54321', '12345 54321', '54321 12345',
        '1 2 3 4 5', '5 4 3 2 1', '12 34', '54 32',
        'ф1 і2 в3 а4 а5', 'а5 а4 в3 і2 ф1',
        'ф1ф1 і2і2 в3в3 а4а4 а5а5',
        'тест1 тест2 тест3', 'код1 код2 код3',
      ],
      
      numbersRight: [
        '6666', '7777', '8888', '9999', '0000',
        '67890', '09876', '67890 09876', '09876 67890',
        '6 7 8 9 0', '0 9 8 7 6', '67 89', '09 87',
        'п6 р7 о8 л9 л0', 'л0 л9 о8 р7 п6',
        'п6п6 р7р7 о8о8 л9л9 л0л0',
        'тест6 тест7 тест8', 'код9 код0',
      ],
      
      numbersBoth: [
        '12345 67890', '67890 12345', '54321 09876', '09876 54321',
        '1 6 2 7 3 8 4 9 5 0', 'ф1 п6 і2 р7 в3 о8',
        'тест1 тест6 тест2 тест7', 'код3 код8 код4 код9',
        '123 456 789 0', '987 654 321',
      ],
      
      capitals: [
        'Ф І В А', 'П Р О Л', 'Й Ц У К Е', 'Н Г Ш Щ',
        'Швидка Коричнева', 'Лисиця Стрибає', 'Через Ледачого',
        'ФІВА ПРОЛ', 'ЙЦУКЕ НГШЩ', 'ЯЧСМІ ТІЬБЮ',
        'Ф ф Ф ф', 'П п П п', 'Й й Й й', 'Н н Н н',
        'Тест Тест', 'Код Код', 'Тип Тип', 'Швидко Швидко',
        'Швидка Лисиця', 'Великий Пес', 'Червоний Авто',
      ],
      
      punctuation: [
        'тест, тест', 'тест. тест', 'тест; тест', 'тест: тест',
        'тест? тест', 'тест! тест', 'теста тест', 'тест-тест',
        'тест, тест. тест; тест:', 'тест? тест! теста тест-тест',
        'привіт, світ', 'так! ні?', 'стоп. йди:', 'теста код',
        'а, б, в, г', 'один. два. три.', 'чому? бо!',
        
        'це є', 'не є', 'він є', 'вона є', 'вони є',
        'мами', 'тата', 'дітей', 'книги',
        
        'так, ні', 'один, два', 'перший, другий', 'а, б, в',
        'тест, код, файл', 'привіт, світ, люди',
        
        'тест, тест.', 'код, код.', 'файл, файл.',
        
        'що?', 'чому?', 'де?', 'коли?', 'як?',
        'так!', 'ні!', 'стоп!', 'йди!', 'чекай!',
        
        'тест; код', 'файл; документ', 'перший; другий',
        'тест: код', 'файл: документ', 'час: 12:00',
      ],
      
      letterCombinations: [
        'шв шв шв', 'ид ид ид', 'ко ко ко', 'ри ри ри',
        'на на на', 'ре ре ре', 'те те те', 'нн нн нн',
        'ов ов ов', 'ее ее ее', 'то то то', 'іт іт іт',
        'іс іс іс', 'ор ор ор', 'ті ті ті', 'ас ас ас',
        'швидка швидка', 'лисиця лисиця', 'стрибає стрибає',
        'чудовий чудовий', 'сфінкс сфінкс', 'кварц кварц',
        'ція ція ція', 'іння іння іння', 'овий овий овий',
        'ення ення ення', 'ання ання ання', 'іння іння іння',
        'ова ова ова', 'ева ева ева', 'іва іва іва',
      ],
      
      mixedRows: [
        'йфя ціч увс', 'кма ені нгш', 'щол тіь', 'бю',
        'йцуке фіва ячсми', 'нгшщ прол тіьбю',
        'й ф я ц і ч у в с', 'к м а е н і н г ш',
        'фіва йцуке', 'прол нгшщ', 'ячсми йцукен',
      ],
      
      commonWords: [
        'швидка коричнева', 'лисиця стрибає', 'через ледачого',
        'пакуй мій ящик', 'з п\'ятьма десятками', 'пляшок',
        'чудовий сфінкс', 'з чорного кварцу', 'суддить мою',
      ],
    },
    hard: {
      
      numbersAdvanced: [
        'тест123 тест456', 'код789 код0', 'ф1і2в3 а4е5п6',
        '123абв 456где', '789жзи 0йкл', 'тест1а тест2б тест3в',
        '2024 2025 2026', '100 200 300', '1.5 2.5 3.5',
        'версія1.0 версія2.0', 'тест-123 тест-456',
        'елемент1, елемент2, елемент3', 'ціна: 100, 200, 300',
      ],
      
      capitalsAdvanced: [
        'Швидка Коричнева Лисиця', 'Стрибає Через Ледачого Пса',
        'Практика Робить Майстра', 'При Вивченні Нових Навичок',
        'Україна Європа Світ', 'Київ Львів Одеса',
        'Дніпро Харків Запоріжжя', 'Мова Програмування',
        'Україна ЄС ООН', 'НБУ СБУ МВС', 'УРЛ УРЛ УРЛ',
        'Пн. Вт. Ср.', 'Січ. Лют. Бер.', 'Понеділок Вівторок',
      ],
      
      punctuationAdvanced: [
        'тест, тест; тест: тест.', 'тест? тест! теста тест-тест',
        'привіт, світ!', 'так, ні; може?', 'стоп. йди: чекай!',
        'теста кода', 'не є не є не є', 'це є він є вона є',
        'тест-тест-тест', 'тест_тест_тест', 'тест.тест.тест',
        'тест, тест, і тест.', 'тест; тест; тест:', 'тест? тест! тест.',
        'ціна: 100.50', 'дата: 31/12/2024', 'час: 15:45',
        'пошта@приклад.укр', 'увеб://www.приклад.укр',
        'тест (дужки)', 'тест [квадратні]', 'тест {фігурні}',
        
        'мами книга', 'тата машина', 'дітей іграшки',
        'не є, не є, не є', 'це є не є', 'він є не є',
        
        'перший, другий, третій, четвертий', 'так, ні, може, не знаю',
        'тест, код, файл, документ', 'а, б, в, г, д, е',
        
        'тест, тест; тест: тест. тест? тест!',
        'привіт, світ! як справи? все добре.',
        'так, ні; може? не знаю!',
        
        'він сказав: "привіт, світ!"', 'це є "тест"',
        'мами "книга"', 'тата "машина"',
      ],
      
      symbols: [
        '! @ # $ %', '% $ # @ !', '^ & * ( )', ') ( * & ^',
        'тест! тест@ тест#', 'тест$ тест% тест^', 'тест& тест*',
        'тест(тест)', 'тест[тест]', 'тест{тест}', 'тест<тест>',
        'тест+тест', 'тест-тест', 'тест=тест', 'тест_тест',
        'тест|тест', 'тест\\тест', 'тест/тест', 'тест?тест',
        'тест~тест', 'тест`тест', 'тест\'тест', 'тест"тест',
        'код += 1', 'значення -= 2', 'результат *= 3', 'всього /= 4',
        'х == у', 'а != б', 'в <= г', 'д >= е',
        'якщо (х && у)', 'якщо (а || б)', 'якщо (!в)',
      ],
      
      complexCombinations: [
        'ція ція ція', 'іння іння іння', 'овий овий овий',
        'шв шв шв', 'ид ид ид', 'ко ко ко', 'ри ри ри',
        'швидка коричнева', 'лисиця стрибає', 'через ледачого',
        'чудовий сфінкс', 'з чорного кварцу', 'суддить мою',
        'втомлені зомбі', 'діяли дивно', 'але продовжували',
      ],
      
      programming: [
        'функція тест()', 'стала х = 1', 'нехай у = 2', 'змінна з = 3',
        'якщо (умова)', 'інакше якщо (інше)', 'для (нехай і = 0)',
        'повернути значення', 'консоль.лог()', 'документ.отриматиЕлементПоІд()',
        'тест1 && тест2', 'тест3 || тест4', '!тест5',
        'х += 1', 'у -= 2', 'з *= 3', 'в /= 4',
        'тест === значення', 'тест !== інше', 'тест <= макс',
        'імпорт { тест }', 'експорт за замовчуванням', 'клас Тест {}',
        'асинхронна функція', 'очікувати обіцянка', 'спробувати { } перехопити',
      ],
      
      mixedAdvanced: [
        'Тест123, тест456!', 'Код789; код0:', 'Версія 1.0, 2.0',
        'Швидка коричнева лисиця стрибає через ледачого пса!',
        'Практика робить майстра при вивченні нових навичок.',
        'Українська, Англійська, та Німецька - популярні мови.',
        'Пошта: тест@приклад.укр, Телефон: (555) 123-4567',
        'Ціна: 100.50, Дата: 31/12/2024, Час: 15:45',
        'якщо (х && у) { повернути з; }', 'стала тест = () => {}',
        '5 швидких коричневих лисиць стрибнули через 3 ледачих псів!',
      ],
    },
  },
};


export const textSamples = {
  en: {
    easy: [
      
      'the cat sat on the mat and looked around the room with big eyes',
      'i like to read books about animals and nature in my free time',
      'she walks in the park every morning and enjoys the fresh air',
      'we play games together and have fun with our friends',
      'the sun shines bright in the sky and makes everything warm',
      'my dog runs fast and likes to chase balls in the garden',
      'birds sing songs in the trees and make beautiful sounds',
      'flowers grow in spring and make the world more colorful',
      'water flows in rivers and streams down to the ocean',
      'children play outside and laugh with joy and happiness',
      'books tell stories about people and places far away',
      'music makes people happy and brings joy to their hearts',
      'food tastes good when you are hungry and need to eat',
      'friends help each other and share good times together',
      'learning new things is fun and makes life more interesting',
      'the moon shines at night and lights up the dark sky',
      'stars twinkle above and look like diamonds in space',
      'rain falls from clouds and waters the plants below',
      'snow covers the ground in winter and makes everything white',
      'wind blows through trees and makes leaves dance around',
    ],
    medium: [
      
      'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.',
      'Technology has transformed the way we communicate and work in modern society. People use computers daily.',
      'Reading books expands your knowledge and improves your vocabulary significantly over time.',
      'Practice makes perfect when learning any new skill or language. Consistency is key to success.',
      'The internet connects people from all around the world instantly through various platforms.',
      'Education provides opportunities for personal growth and career development in many fields.',
      'Science helps us understand the world around us through observation and experimentation.',
      'Art expresses human creativity and emotions through various forms like painting and music.',
      'History teaches us about past events and helps us learn from previous experiences.',
      'Nature provides resources that humans need to survive and thrive on this planet.',
    ],
    hard: [
      
      'The development of artificial intelligence (AI) has revolutionized numerous industries, from healthcare to transportation, creating both opportunities and challenges for society in the 21st century.',
      'Climate change represents one of the most pressing issues facing humanity today, requiring immediate action and international cooperation to address environmental concerns.',
      'Literature serves as a window into different cultures, historical periods, and human experiences, enriching our understanding of the world around us.',
      'Scientific research continues to push the boundaries of human knowledge, revealing mysteries of the universe and improving our daily lives through innovation.',
      'Education is the foundation of personal growth and societal progress, empowering individuals to achieve their full potential in various fields.',
      'Programming languages like Python, JavaScript, and Rust offer powerful features that make software development more efficient and enjoyable for developers worldwide.',
      'The history of the internet is a fascinating story of innovation and collaboration, transforming from a military project into a global network connecting billions of people.',
      'Mathematics provides tools for understanding patterns, solving problems, and making predictions in fields ranging from physics to economics and beyond.',
      'Philosophy explores fundamental questions about existence, knowledge, values, and reason, influencing how we think about the world and our place in it.',
      'Medicine combines scientific knowledge with compassionate care to treat diseases, improve health, and extend human life expectancy significantly over the past century.',
    ],
  },
  uk: {
    easy: [
      
      'кіт сидить на килимі і дивиться навколо кімнати великими очима',
      'я люблю читати книги про тварин і природу у вільний час',
      'вона гуляє в парку кожного ранку і насолоджується свіжим повітрям',
      'ми граємо разом і весело проводимо час з нашими друзями',
      'сонце світить яскраво на небі і робить все навколо теплим',
      'мій пес бігає швидко і любить ловити м\'ячі в саду',
      'птахи співають пісні на деревах і створюють красиві звуки',
      'квіти ростуть навесні і роблять світ більш кольоровим',
      'вода тече в річках і струмках до океану',
      'діти грають на вулиці і сміються від радості та щастя',
      'книги розповідають історії про людей і місця далеко',
      'музика робить людей щасливими і приносить радість у їхні серця',
      'їжа смачна коли ти голодний і потребуєш поїсти',
      'друзі допомагають один одному і діляться хорошими моментами',
      'вивчення нових речей цікаве і робить життя більш захоплюючим',
      'місяць світить вночі і освітлює темне небо',
      'зірки мерехтять вгорі і виглядають як діаманти в космосі',
      'дощ падає з хмар і поливає рослини внизу',
      'сніг покриває землю взимку і робить все білим',
      'вітер дме через дерева і змушує листя танцювати навколо',
    ],
    medium: [
      
      'Швидка коричнева лисиця стрибає через ледачого пса. Це речення містить багато різних букв.',
      'Технології змінили спосіб спілкування та роботи в сучасному суспільстві. Люди використовують комп\'ютери щодня.',
      'Читання книг розширює знання та значно покращує словниковий запас з часом.',
      'Практика робить майстра при вивченні будь-якої нової навички або мови. Послідовність є ключем до успіху.',
      'Інтернет з\'єднує людей з усього світу миттєво через різні платформи.',
      'Освіта надає можливості для особистісного зростання та кар\'єрного розвитку в багатьох сферах.',
      'Наука допомагає нам зрозуміти світ навколо нас через спостереження та експериментування.',
      'Мистецтво виражає людську творчість та емоції через різні форми, такі як живопис і музика.',
      'Історія вчить нас про минулі події та допомагає вчитися з попередніх досвідів.',
      'Природа надає ресурси, які потрібні людям для виживання та процвітання на цій планеті.',
    ],
    hard: [
      
      'Розвиток штучного інтелекту (ШІ) революціонізував численні галузі, від охорони здоров\'я до транспорту, створюючи як можливості, так і виклики для суспільства у 21 столітті.',
      'Зміна клімату є одним з найбільш актуальних питань, що стоять перед людством сьогодні, вимагаючи негайних дій та міжнародної співпраці для вирішення екологічних проблем.',
      'Література служить вікном у різні культури, історичні періоди та людський досвід, збагачуючи наше розуміння світу навколо нас.',
      'Наукові дослідження продовжують розширювати межі людських знань, розкриваючи таємниці всесвіту та покращуючи наше повсякденне життя через інновації.',
      'Освіта є основою особистісного зростання та суспільного прогресу, надаючи людям можливість реалізувати свій повний потенціал у різних сферах.',
      'Мови програмування, такі як Python, JavaScript та Rust, пропонують потужні функції, які роблять розробку програмного забезпечення більш ефективною та приємною для розробників у всьому світі.',
      'Історія інтернету є захоплюючою історією інновацій та співпраці, трансформуючись з військового проекту в глобальну мережу, що з\'єднує мільярди людей.',
      'Математика надає інструменти для розуміння закономірностей, вирішення проблем та прогнозування в сферах від фізики до економіки та далі.',
      'Філософія досліджує фундаментальні питання про існування, знання, цінності та розум, впливаючи на те, як ми думаємо про світ та наше місце в ньому.',
      'Медицина поєднує наукові знання з співчутливою піклуванням для лікування хвороб, покращення здоров\'я та значного подовження тривалості життя людей за останнє століття.',
    ],
  },
};


export const fingerMap = {
  
  'q': 'pinky-l', 'a': 'pinky-l', 'z': 'pinky-l',
  'w': 'ring-l', 's': 'ring-l', 'x': 'ring-l',
  'e': 'middle-l', 'd': 'middle-l', 'c': 'middle-l',
  'r': 'index-l', 't': 'index-l', 'f': 'index-l', 'g': 'index-l',
  'v': 'index-l', 'b': 'index-l',
  
  'y': 'index-r', 'u': 'index-r', 'h': 'index-r', 'j': 'index-r',
  'n': 'index-r', 'm': 'index-r',
  'i': 'middle-r', 'k': 'middle-r', ',': 'middle-r',
  'o': 'ring-r', 'l': 'ring-r', '.': 'ring-r',
  'p': 'pinky-r', ';': 'pinky-r', '/': 'pinky-r',
  
  
  '1': 'pinky-l', '2': 'ring-l', '3': 'middle-l', '4': 'index-l', '5': 'index-l',
  '6': 'index-r', '7': 'index-r', '8': 'middle-r', '9': 'ring-r', '0': 'pinky-r',
  
  
  '`': 'pinky-l', '~': 'pinky-l',
  '-': 'pinky-r', '=': 'pinky-r',
  '[': 'pinky-r', ']': 'pinky-r',
  '\\': 'pinky-r', '|': 'pinky-r',
  "'": 'pinky-r', '"': 'pinky-r',
  '?': 'pinky-r',
  '!': 'pinky-l',
  '@': 'pinky-l',
  '#': 'pinky-l',
  '$': 'pinky-l',
  '%': 'pinky-l',
  '^': 'pinky-l',
  '&': 'pinky-l',
  '*': 'pinky-l',
  '(': 'pinky-r',
  ')': 'pinky-r',
  '_': 'pinky-r',
  '+': 'pinky-r',
  '{': 'pinky-r',
  '}': 'pinky-r',
  ':': 'pinky-r',
  ';': 'pinky-r',
  '<': 'pinky-r',
  '>': 'pinky-r',
  '/': 'pinky-r',
  ',': 'middle-r',
  '.': 'ring-r',
  
  ' ': 'thumb',
};


export const fingerMapUk = {
  
  'й': 'pinky-l', 'ф': 'pinky-l', 'я': 'pinky-l',
  'ц': 'ring-l', 'і': 'ring-l', 'ч': 'ring-l',
  'у': 'middle-l', 'в': 'middle-l', 'с': 'middle-l',
  'к': 'index-l', 'е': 'index-l', 'а': 'index-l', 'п': 'index-l',
  'м': 'index-l', 'и': 'index-l',
  
  
  'н': 'index-r', 'г': 'index-r', 'р': 'index-r', 'о': 'index-r',
  'т': 'index-r', 'ь': 'index-r',
  'ш': 'middle-r', 'л': 'middle-r', 'б': 'middle-r',
  'щ': 'ring-r', 'д': 'ring-r', 'ю': 'ring-r',
  'з': 'pinky-r', 'ж': 'pinky-r', 'х': 'pinky-r', 'ї': 'pinky-r', 'є': 'pinky-r',
  
  
  '1': 'pinky-l', '2': 'ring-l', '3': 'middle-l', '4': 'index-l', '5': 'index-l',
  '6': 'index-r', '7': 'index-r', '8': 'middle-r', '9': 'ring-r', '0': 'pinky-r',
  
  
  '`': 'pinky-l', "'": 'pinky-l', '~': 'pinky-l',
  '!': 'pinky-l',
  '"': 'ring-l',
  '№': 'middle-l',
  ';': 'index-l',
  '%': 'index-l',
  ':': 'index-r',
  '?': 'index-r',
  '*': 'middle-r',
  '(': 'ring-r',
  ')': 'pinky-r',
  '-': 'pinky-r', '_': 'pinky-r',
  '=': 'pinky-r', '+': 'pinky-r',
  '\\': 'pinky-r', '/': 'pinky-r',
  '.': 'ring-r',
  ',': 'ring-r',  
  
  
  '[': 'pinky-r', ']': 'pinky-r',
  '{': 'pinky-r', '}': 'pinky-r',
  
  ' ': 'thumb',
};
