echo "START MIGRATIONS"
rake db:migrate
echo "FINISH MIGRATIONS"

echo "START COMPILE ASSETS"
rake assets:precompile
echo "FINISH COMPILE ASSETS"
