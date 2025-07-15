from marshmallow import Schema, fields, validate

class HackathonCreateSchema(Schema):
    title = fields.String(required=True, validate=validate.Length(min=3, max=255))
    description = fields.String(required=False, allow_none=True)
    start_date = fields.DateTime(required=False)
    end_date = fields.DateTime(required=False)
    max_teams = fields.Integer(required=False)
    max_team_members = fields.Integer(required=False)
    tags = fields.List(fields.String(), required=False)
    rules = fields.List(fields.String(), required=False)

class HackathonUpdateSchema(Schema):
    title = fields.String(validate=validate.Length(min=3, max=255))
    description = fields.String(allow_none=True)
    start_date = fields.DateTime(allow_none=True)
    end_date = fields.DateTime(allow_none=True)
    max_teams = fields.Integer(validate=validate.Range(min=1))
    max_team_members = fields.Integer(validate=validate.Range(min=1))
    tags = fields.List(fields.String())
    rules = fields.List(fields.String())
