import { NodeModel } from "./model";


export class CodeModel extends NodeModel {
  static type = 'code';
  static readonly defaultInputs = ['code']; // TODO: enum
  static readonly additionalInputs = ['code'];
  static readonly defaultOutputs = ['code'];
  static readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(false, CodeModel.type, 'untitled', 'blue');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class CodeGenModel extends NodeModel {
  static type = 'codeGen';
  static readonly defaultInputs = ['code'];
  static readonly additionalInputs = ['code'];
  static readonly defaultOutputs = ['code'];
  static readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(false, CodeGenModel.type, 'untitled', 'blue');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class TestModel extends NodeModel {
  static type = 'test';
  static readonly defaultInputs = ['code'];
  static readonly additionalInputs = ['code'];
  static readonly defaultOutputs = ['code'];
  static readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(false, TestModel.type, 'untitled', 'yellow');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class BuildModel extends NodeModel {
  static type = 'build';
  static readonly defaultInputs = ['code'];
  static readonly additionalInputs = ['code'];
  static readonly defaultOutputs = ['code'];
  static readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(false, BuildModel.type, 'untitled', 'yellow');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ServiceModel extends NodeModel {
  static type = 'service';
  static readonly defaultInputs = ['code'];
  static readonly additionalInputs = ['code'];
  static readonly defaultOutputs = ['code'];
  static readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(false, ServiceModel.type, 'untitled', 'green');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ServiceHostModel extends NodeModel {
  static type = 'serviceHost';
  static readonly defaultInputs = ['code'];
  static readonly additionalInputs = ['code'];
  static readonly defaultOutputs = ['code'];
  static readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(false, ServiceHostModel.type, 'untitled', 'green');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ApiMapperModel extends NodeModel {
  static type = 'apiMapper';
  root = true;
  static readonly defaultInputs = ['code'];
  static readonly additionalInputs = ['code'];
  static readonly defaultOutputs = ['code'];
  static readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(false, ApiMapperModel.type, 'untitled', 'purple');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class CodeContainerModel extends NodeModel {
  static type = 'codeContainer';
  static readonly contains = ['code', 'codeGen'];
  static readonly defaultInputs = ['code'];
  static readonly additionalInputs = ['code'];
  static readonly defaultOutputs = ['code'];
  static readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(true, CodeContainerModel.type, 'untitled', 'blue');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class BuildContainerModel extends NodeModel {
  static type = 'buildContainer';
  static readonly root = true;
  static readonly contains = ['test', 'build', 'codeContainer'];
  static readonly defaultInputs = ['code'];
  static readonly additionalInputs = ['code'];
  static readonly defaultOutputs = ['code'];
  static readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(true, BuildContainerModel.type, 'untitled', 'yellow');
  }

	public get outputs() {
		return []; // TODO
	}
}

export class ServiceContainerModel extends NodeModel {
  static type = 'serviceContainer';
  static readonly root = true;
  static readonly contains = ['service', 'serviceHost', 'apiMapper', 'serviceContainer'];
  static readonly defaultInputs = ['code'];
  static readonly additionalInputs = ['code'];
  static readonly defaultOutputs = ['code'];
  static readonly additionalOutputs = ['implementedEvent'];

  constructor() {
    super(true, ServiceContainerModel.type, 'untitled', 'green');
  }

	public get outputs() {
		return []; // TODO
	}
}
