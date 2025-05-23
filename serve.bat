@REM bundle exec jekyll serve
docker run --rm -it -v D:/my_projects/khoatong2510.github.io:/home -e JEKYLL_ENV=development -p 4000:4000 sha256:400b8d1569f118bca8a3a09a25f32803b00a55d1ea241feaf5f904d66ca9c625 bash
