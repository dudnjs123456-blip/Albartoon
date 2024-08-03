chmod +x remove_large_files.sh
./remove_large_files.shgit lfs track "fetch/client/mo/node_modules/.cache/**/*.pack"
git lfs track "fetch/client/mo/node_modules/node-sass/build/release/sass.a"

git add .gitattributes
git commit -m "Track large files with Git LFS"
git push origin main#!/bin/bash

# 삭제할 파일 크기 기준 (예: 100MB)
threshold=104857600  # 100MB

# 대용량 파일 확인 및 삭제
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(rest)' | grep blob | awk '$1 == "blob" { print $3 }' | while read -r file; do
    size=$(git cat-file -s "$file")
    if [ "$size" -gt "$threshold" ]; then
        echo "Deleting large file: $file (size: $size bytes)"
        git rm --cached "$file"  # Git에서만 삭제, 로컬 파일은 유지
    fi
done

# 변경 사항 커밋
git commit -m "Remove large files automatically"

#!/bin/bash

# 삭제할 파일 크기 기준 (예: 100MB)
threshold=104857600  # 100MB

# 대용량 파일 확인 및 삭제
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(rest)' | grep blob | awk '$1 == "blob" { print $3 }' | while read -r file; do
    size=$(git cat-file -s "$file")
    if [ "$size" -gt "$threshold" ]; then
        echo "Deleting large file: $file (size: $size bytes)"
        git rm --cached "$file"  # Git에서만 삭제, 로컬 파일은 유지
    fi
done

# 변경 사항 커밋
git commit -m "Remove large files automatically"
chmod +x remove_large_files.sh
./remove_large_files.shgit lfs track "fetch/client/mo/node_modules/.cache/**/*.pack"
git lfs track "fetch/client/mo/node_modules/node-sass/build/release/sass.a"

git add .gitattributes
git commit -m "Track large files with Git LFS"
git push origin main

ㅂ
q


