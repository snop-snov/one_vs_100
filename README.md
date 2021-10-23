# Концепт игры:
Ты будущий начальник, должен за короткое время мотивировать 100 сотрудников на работу

# Сценарий:
- пользователь заходит на страничку
- его просят ответить на ряд вопросов, как бы он хотел, чтобы его мотивировали на работу, если он девелопер/продажник/тестер/менеджер и т.д.
- дальше он видит область в которой есть 100 точек-сотрудников, и одна точка-начальник
- точки-сотрудники разных цветов (по ролям в проекте)
- игрок играет за начальника
- сотрудники разбегаются от начальника
- игрок должен подбежать к сотруднику и в близкой области (пока сотрудник не убежал) нажать на кнопку, уговорив сотрудника работать.
- при этом на экране показывается ранее введенный текст, соответствующий нажатой кнопке
- если сотрудник попал в область вокруг начальника в момент "призыва", точка уходит на периметр "работать" и больше не участвует

# TODO
для начала сделать один тип сотрудников
далее можно развивать игру, заменяя нажатие на кнопку голосовой командой (распознаем голос в текст, он должен совпадать с изначальным вводом)

# Deploy
## setup
```
heroku login
heroku git:remote -a one-vs-100
heroku stack:set container
```

## deploy
```
git push
```
