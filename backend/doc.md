delete all migratios:

```
$ find . -path "*/migrations/*.py" -not -name "__init__.py" -delete && rm db.sqlite3 
```