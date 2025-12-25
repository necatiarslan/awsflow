build:
    vsce package
    mv *.vsix ./vsix/

build_newversion:
    node -e "const fs=require('fs');const p='package.json';const pkg=JSON.parse(fs.readFileSync(p,'utf8'));const [a,b,c]=pkg.version.split('.').map(Number);pkg.version=[a,b,c+1].join('.');fs.writeFileSync(p, JSON.stringify(pkg, null, 2)+'\n');"
    vsce package
    mv *.vsix ./vsix/

publish:
    vsce publish

npm-doctor:
    npm doctor # check dependencies
    npm prune # remove unused dependencies
    npx depcheck # check dependencies
    npm-check # check dependencies

npm-outdated:
    npm outdated
    npx npm-check-updates

npm-update:
    npm update

npm-install:
    rm -rf node_modules package-lock.json
    npm install
    npx tsc --noEmit

npm-clean:
    npm list --depth=0                    # Audit current deps
    depcheck                              # Find unused
    npm ci --omit=dev                     # Test production-only build
    npm prune                             # Remove orphaned packages
    npm dedupe                            # Consolidate versions

localstack_start:
    localstack start

localstack_stop:
    localstack stop

localstack_status:
    localstack status

localstack_logs:
    localstack logs

localstack_help:
    localstack --help 

localstack_update:
    localstack update

create_bucket:
    aws --endpoint-url=http://localhost:4566 s3 mb s3://my-bucket

list_buckets:
    aws --endpoint-url=http://localhost:4566 s3 ls

list_bucket_content:
    aws --endpoint-url=http://localhost:4566 s3 ls s3://my-bucket

upload_file:
    aws --endpoint-url=http://localhost:4566 s3 cp README.md s3://my-bucket