/**
 * Скрипт автоматического обновления рейтингов игроков PSA World Tour.
 * 
 * Как запустить:
 * node scripts/update-rankings.js
 * 
 * Скрипт:
 * 1. Получает актуальные рейтинги топ-100 мужчин и женщин с сайта SquashInfo.
 * 2. Пробегается по всем файлам в папке /players/.
 * 3. Если файл помечен как custom: true, он полностью игнорируется (ваши личные данные не изменятся).
 * 4. Если файл относится к профессиональному игроку, его ранг автоматически обновляется на актуальный.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const matter = require('gray-matter');

const PLAYERS_DIR = path.join(process.cwd(), 'players');

// Функция для парсинга рейтингов с SquashInfo
async function fetchRankings(genderCode) {
  const url = `https://www.squashinfo.com/rankings/${genderCode === 'male' ? 'men' : 'women'}`;
  console.log(`Получение данных с ${url}...`);
  
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(data);
    const rankings = {};
    
    // Парсим таблицу рейтингов
    $('table tbody tr').each((index, element) => {
      const rankText = $(element).find('td').eq(0).text().trim();
      const nameText = $(element).find('td').eq(2).text().trim();
      
      const rank = parseInt(rankText, 10);
      if (rank && nameText) {
        // Приводим имя к стандартному английскому виду для сопоставления
        const normalizedName = nameText.toLowerCase().replace(/[^a-z\s]/g, '').trim();
        rankings[normalizedName] = rank;
      }
    });
    
    return rankings;
  } catch (error) {
    console.error(`Ошибка при получении рейтинга для ${genderCode}:`, error.message);
    return null;
  }
}

// Нормализация имени для сопоставления (например, "Paul Coll" -> "paul coll")
function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z\s]/g, '').trim();
}

async function main() {
  console.log('=== Запуск обновления рейтингов PSA ===');
  
  if (!fs.existsSync(PLAYERS_DIR)) {
    console.error(`Папка ${PLAYERS_DIR} не найдена.`);
    return;
  }
  
  // Получаем актуальные рейтинги
  const menRankings = await fetchRankings('male');
  const womenRankings = await fetchRankings('female');
  
  if (!menRankings && !womenRankings) {
    console.error('Не удалось получить данные о рейтингах. Обновление отменено.');
    return;
  }
  
  const filenames = fs.readdirSync(PLAYERS_DIR).filter(fn => fn.endsWith('.md'));
  let updatedCount = 0;
  let customCount = 0;
  let skippedCount = 0;
  
  filenames.forEach((filename) => {
    const filePath = path.join(PLAYERS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    // 1. Проверяем, является ли игрок кастомным (любительским)
    if (data.custom === true) {
      console.log(`[Игнорирование] Любительский профиль: ${data.name} (${filename})`);
      customCount++;
      return;
    }
    
    const normalizedEnName = normalizeName(data.nameEn || '');
    const currentRank = data.rank;
    let newRank = null;
    
    // 2. Ищем новый ранг в спарсенных данных
    if (data.gender === 'male' && menRankings) {
      newRank = menRankings[normalizedEnName] || null;
    } else if (data.gender === 'female' && womenRankings) {
      newRank = womenRankings[normalizedEnName] || null;
    }
    
    // 3. Если ранг изменился, обновляем файл
    if (newRank !== currentRank) {
      data.rank = newRank;
      
      // Пересобираем frontmatter
      const updatedFrontmatter = matter.stringify(content, data);
      fs.writeFileSync(filePath, updatedFrontmatter, 'utf-8');
      
      console.log(`[Обновлено] ${data.name}: #${currentRank} -> ${newRank ? '#' + newRank : 'вне топ-100'}`);
      updatedCount++;
    } else {
      skippedCount++;
    }
  });
  
  console.log('\n=== Отчет об обновлении ===');
  console.log(`Всего проверено файлов: ${filenames.length}`);
  console.log(`Обновлено профилей профессионалов: ${updatedCount}`);
  console.log(`Остались без изменений: ${skippedCount}`);
  console.log(`Проигнорировано любительских профилей (custom: true): ${customCount}`);
}

main();
