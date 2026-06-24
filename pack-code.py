import os

# Папки и файлы, которые мы игнорируем, чтобы файл не получился огромным
IGNORE_DIRS = {'.git', 'node_modules', '.next', 'out', 'processed_images', 'raw_images', 'media', 'staticfiles'}
IGNORE_FILES = {'.DS_Store', 'package-lock.json'}
# Расширения файлов, исходный код которых нам интересен
TARGET_EXTENSIONS = ('.js', '.jsx', '.json', '.css', '.md', '.html', '.py')

def main():
    output_filename = 'codebase.txt'
    count = 0
    
    with open(output_filename, 'w', encoding='utf-8') as outfile:
        # Рекурсивный обход папок
        for root, dirs, files in os.walk('.'):
            # Удаляем игнорируемые папки из списка обхода на месте
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
            for file in files:
                if file in IGNORE_FILES:
                    continue
                
                if file.endswith(TARGET_EXTENSIONS) and file != output_filename and file != 'pack-code.py':
                    filepath = os.path.join(root, file)
                    # Записываем разделитель и относительный путь к файлу
                    outfile.write(f'=== START OF FILE {filepath} ===\n')
                    try:
                        with open(filepath, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                        count += 1
                    except Exception as e:
                        outfile.write(f'[Ошибка чтения файла: {e}]\n')
                    outfile.write(f'\n=== END OF FILE {filepath} ===\n\n')
                    
    print(f'[+] Готово! Собран исходный код {count} файлов в один файл: {output_filename}')

if __name__ == '__main__':
    main()