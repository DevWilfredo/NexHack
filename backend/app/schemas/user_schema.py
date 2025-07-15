from marshmallow import Schema, fields, validate

class UserRegisterSchema(Schema):
    firstname = fields.String(required=True, validate=validate.Length(min=2))
    lastname = fields.String(required=True, validate=validate.Length(min=2))
    email=fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))

class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))
    