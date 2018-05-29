#!/bin/bash
docker exec -it $(docker ps | grep emu_api | awk '{ print $1 }') /bin/sh -c 'npm run db-seed'