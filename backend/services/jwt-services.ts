import { GetParameterCommand } from "@aws-sdk/client-ssm";
import ssm from "../ssm-client";
import jwt from 'jsonwebtoken';

export const generateToken = async (userId: string) => {
  const jwtSecretKeyValue = await loadJwtSecretKey();
  const token = jwt.sign({
    sub: userId
  }, jwtSecretKeyValue, {
    expiresIn: '1h',
  });
  return token;
};

export const loadJwtSecretKey = async (): Promise<string> => {
    const jwtSecretParamName = process.env.JWT_SECRET_KEY_PARAM_NAME;
    const jwtSecretParam = await ssm.send(new GetParameterCommand({
        Name: jwtSecretParamName,
        WithDecryption: true,
    }));
    return jwtSecretParam.Parameter?.Value!;
};
