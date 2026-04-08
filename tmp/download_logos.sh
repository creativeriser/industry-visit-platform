#!/bin/bash
mkdir -p public/logos

curl -L "https://upload.wikimedia.org/wikipedia/commons/b/b1/HCL_Technologies_logo.svg" -o public/logos/hcl.svg
curl -L "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg" -o public/logos/deloitte.svg
curl -L "https://upload.wikimedia.org/wikipedia/commons/9/9d/KPMG_logo.svg" -o public/logos/kpmg.svg
curl -L "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" -o public/logos/ibm.svg
curl -L "https://upload.wikimedia.org/wikipedia/commons/0/00/Huawei.svg" -o public/logos/huawei.svg
curl -L "https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg" -o public/logos/nokia.svg
curl -L "https://upload.wikimedia.org/wikipedia/commons/8/87/MediaTek_logo.svg" -o public/logos/mediatek.svg
curl -L "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" -o public/logos/microsoft.svg
curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/STPI_Logo.jpg/1200px-STPI_Logo.jpg" -o public/logos/stpi.jpg
